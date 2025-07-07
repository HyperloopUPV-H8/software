use anyhow::{Result, Context};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::net::UdpSocket;
use tokio::sync::Mutex;
use tokio::time::{interval, Duration};
use tracing::{debug, error, info, trace};

mod macos;
mod sender;

pub use sender::PacketSender;

use crate::adj::{ADJ, Board};
use crate::generator::PacketGenerator;

pub struct NetworkManager {
    backend_addr: SocketAddr,
    adj: ADJ,
    sockets: Arc<Mutex<Vec<BoardSocket>>>,
}

struct BoardSocket {
    board: Board,
    socket: Arc<UdpSocket>,
    generator: PacketGenerator,
}

impl NetworkManager {
    pub async fn new(backend_host: &str, backend_port: u16, adj: ADJ) -> Result<Self> {
        let backend_addr = format!("{}:{}", backend_host, backend_port)
            .parse()
            .context("Invalid backend address")?;
        
        let sockets = Arc::new(Mutex::new(Vec::new()));
        
        Ok(Self {
            backend_addr,
            adj,
            sockets,
        })
    }
    
    pub async fn initialize_boards(&mut self) -> Result<()> {
        let mut sockets = self.sockets.lock().await;
        
        for board in &self.adj.boards {
            info!("Initializing socket for board {} ({})", board.name, board.ip);
            
            // Create socket with board's IP
            let socket = create_board_socket(&board.ip, &self.backend_addr).await?;
            
            let board_socket = BoardSocket {
                board: board.clone(),
                socket: Arc::new(socket),
                generator: PacketGenerator::new(board.clone()),
            };
            
            sockets.push(board_socket);
        }
        
        info!("Initialized {} board sockets", sockets.len());
        Ok(())
    }
    
    pub async fn send_packet(&self, board_name: &str, packet_data: Vec<u8>) -> Result<()> {
        let sockets = self.sockets.lock().await;
        
        let board_socket = sockets
            .iter()
            .find(|bs| bs.board.name == board_name)
            .ok_or_else(|| anyhow::anyhow!("Board {} not found", board_name))?;
        
        board_socket.socket.send(&packet_data).await?;
        trace!("Sent {} bytes from board {}", packet_data.len(), board_name);
        
        Ok(())
    }
    
    pub async fn start_random_generation(&self, rate: u32) -> Result<()> {
        let interval_ms = 1000 / rate;
        let mut interval = interval(Duration::from_millis(interval_ms as u64));
        
        info!("Starting packet generation at {} packets/second", rate);
        
        loop {
            interval.tick().await;
            
            let sockets = self.sockets.lock().await;
            if sockets.is_empty() {
                error!("No board sockets available");
                continue;
            }
            
            // Select random board
            let idx = rand::random::<usize>() % sockets.len();
            let board_socket = &sockets[idx];
            
            // Generate random packet
            if let Ok(packet_data) = board_socket.generator.generate_random_data_packet() {
                if let Err(e) = board_socket.socket.send(&packet_data).await {
                    error!("Failed to send packet from {}: {}", board_socket.board.name, e);
                } else {
                    trace!("Sent {} bytes from {}", packet_data.len(), board_socket.board.name);
                }
            }
        }
    }
}

async fn create_board_socket(board_ip: &str, backend_addr: &SocketAddr) -> Result<UdpSocket> {
    // Bind to board's IP with port 0 (let OS assign)
    let bind_addr = format!("{}:0", board_ip);
    
    debug!("Creating socket: {} -> {}", bind_addr, backend_addr);
    
    let socket = UdpSocket::bind(&bind_addr)
        .await
        .context(format!("Failed to bind to {}", bind_addr))?;
    
    // Apply macOS-specific configurations
    macos::configure_socket(&socket)?;
    
    // Connect to backend
    socket.connect(backend_addr)
        .await
        .context("Failed to connect to backend")?;
    
    let local_addr = socket.local_addr()?;
    info!("Socket created: {} -> {}", local_addr, backend_addr);
    
    Ok(socket)
}
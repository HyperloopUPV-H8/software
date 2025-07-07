use anyhow::Result;
use clap::{Parser, Subcommand};
use std::path::PathBuf;
use tracing::info;
use tracing_subscriber;

mod adj;
mod network;
mod generator;
mod cli;
mod test_listener;

use crate::cli::InteractiveMode;
use crate::network::PacketSender;

#[derive(Parser)]
#[command(name = "packet-sender")]
#[command(about = "Hyperloop packet sender for testing backend and frontend", long_about = None)]
struct Cli {
    /// Path to ADJ directory (defaults to ../backend/cmd/adj)
    #[arg(short, long, default_value = "../backend/cmd/adj")]
    adj_path: PathBuf,

    /// Log level (trace, debug, info, warn, error)
    #[arg(short, long, default_value = "info")]
    log_level: String,

    /// Backend address (overrides ADJ if specified)
    #[arg(short, long)]
    backend_address: Option<String>,

    /// Backend UDP port (overrides ADJ if specified)
    #[arg(short, long)]
    backend_port: Option<u16>,

    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Run in interactive mode
    Interactive,
    
    /// Send random packets continuously
    Random {
        /// Packets per second
        #[arg(short, long, default_value_t = 100)]
        rate: u32,
        
        /// Specific board to simulate (if not specified, all boards)
        #[arg(short, long)]
        board: Option<String>,
    },
    
    /// Send packets from a specific board
    Board {
        /// Board name
        name: String,
        
        /// Packet sending mode
        #[arg(short, long, default_value = "random")]
        mode: String,
    },
    
    /// List available boards and packets
    List,
    
    /// Start a test UDP listener (for testing without backend)
    Listen {
        /// Address to listen on
        #[arg(short, long, default_value = "127.0.0.9:8000")]
        address: String,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    
    // Initialize logging
    tracing_subscriber::fmt()
        .with_env_filter(cli.log_level)
        .init();
    
    info!("Starting Hyperloop packet sender");
    info!("Loading ADJ from: {:?}", cli.adj_path);
    
    // Load ADJ
    let adj = adj::load_adj(&cli.adj_path).await?;
    info!("Loaded {} boards from ADJ", adj.boards.len());
    
    // Get backend address and port from ADJ or CLI args
    let backend_address = cli.backend_address.unwrap_or_else(|| {
        adj.info.addresses.get("backend")
            .cloned()
            .unwrap_or_else(|| "127.0.0.9".to_string())
    });
    
    let backend_port = cli.backend_port.unwrap_or_else(|| {
        adj.info.ports.get("UDP")
            .copied()
            .unwrap_or(8000)
    });
    
    info!("Backend address: {}:{}", backend_address, backend_port);
    
    // Create packet sender
    let mut sender = PacketSender::new(
        &backend_address,
        backend_port,
        adj.clone(),
    ).await?;
    
    match cli.command {
        None | Some(Commands::Interactive) => {
            info!("Starting interactive mode");
            let interactive = InteractiveMode::new(sender);
            interactive.run().await?;
        }
        
        Some(Commands::Random { rate, board }) => {
            info!("Starting random packet generation at {} packets/second", rate);
            if let Some(board_name) = board {
                sender.start_random_single(&board_name, rate).await?;
            } else {
                sender.start_random_all(rate).await?;
            }
        }
        
        Some(Commands::Board { name, mode }) => {
            info!("Simulating board {} in {} mode", name, mode);
            sender.simulate_board(&name, &mode).await?;
        }
        
        Some(Commands::List) => {
            println!("Available boards:");
            for board in &adj.boards {
                println!("  - {} (IP: {}, {} packets)", board.name, board.ip, board.packets.len());
            }
        }
        
        Some(Commands::Listen { address }) => {
            println!("Starting test listener on {}", address);
            println!("Press Ctrl+C to stop");
            
            // Run listener in a blocking thread
            let handle = std::thread::spawn(move || {
                if let Err(e) = test_listener::start_test_listener(&address) {
                    eprintln!("Listener error: {}", e);
                }
            });
            
            // Wait for Ctrl+C
            tokio::signal::ctrl_c().await?;
            println!("\nShutting down listener...");
            std::process::exit(0);
        }
    }
    
    Ok(())
}

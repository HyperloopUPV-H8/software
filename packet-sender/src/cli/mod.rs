use anyhow::Result;
use std::io::{self, Write};
use tokio::task;

use crate::network::PacketSender;

mod manual;
use manual::ManualPacketBuilder;

pub struct InteractiveMode {
    sender: PacketSender,
}

impl InteractiveMode {
    pub fn new(sender: PacketSender) -> Self {
        Self { sender }
    }
    
    pub async fn run(self) -> Result<()> {
        println!("Hyperloop Packet Sender - Interactive Mode");
        println!("Type 'help' for available commands");
        
        loop {
            print!("> ");
            io::stdout().flush()?;
            
            let mut input = String::new();
            io::stdin().read_line(&mut input)?;
            
            let parts: Vec<&str> = input.trim().split_whitespace().collect();
            if parts.is_empty() {
                continue;
            }
            
            match parts[0] {
                "help" | "h" => self.show_help(),
                "list" | "l" => self.list_boards(),
                "board" | "b" => {
                    if parts.len() >= 2 {
                        self.show_board_info(parts[1]);
                    } else {
                        println!("Usage: board <board_name>");
                    }
                }
                "manual" | "m" => {
                    if parts.len() >= 2 {
                        self.send_manual_packet(parts[1]).await?;
                    } else {
                        println!("Usage: manual <board_name>");
                    }
                }
                "random" | "r" => {
                    if parts.len() >= 2 {
                        let rate = parts.get(2)
                            .and_then(|s| s.parse().ok())
                            .unwrap_or(100);
                        
                        let mut sender = self.sender.clone();
                        let board = parts[1].to_string();
                        
                        println!("Starting random generation for {} at {} pps (Ctrl+C to stop)", board, rate);
                        
                        task::spawn(async move {
                            let _ = sender.start_random_single(&board, rate).await;
                        });
                    } else {
                        println!("Usage: random <board_name> [rate]");
                    }
                }
                "simulate" | "sim" | "s" => {
                    if parts.len() >= 3 {
                        let mut sender = self.sender.clone();
                        let board = parts[1].to_string();
                        let mode = parts[2].to_string();
                        
                        println!("Starting {} simulation for {} (Ctrl+C to stop)", mode, board);
                        
                        task::spawn(async move {
                            let _ = sender.simulate_board(&board, &mode).await;
                        });
                    } else {
                        println!("Usage: simulate <board_name> <mode>");
                        println!("Modes: random, sine, sequence");
                    }
                }
                "quit" | "q" | "exit" => {
                    println!("Goodbye!");
                    break;
                }
                _ => {
                    println!("Unknown command: {}", parts[0]);
                    println!("Type 'help' for available commands");
                }
            }
        }
        
        Ok(())
    }
    
    fn show_help(&self) {
        println!("Available commands:");
        println!("  help, h                       - Show this help message");
        println!("  list, l                       - List all boards");
        println!("  board, b <name>               - Show board information");
        println!("  manual, m <board>             - Manually build and send a packet");
        println!("  random, r <board> [rate]      - Start random packet generation");
        println!("  simulate, sim, s <board> <mode> - Start simulation (modes: random, sine, sequence)");
        println!("  quit, q, exit                 - Exit the program");
    }
    
    fn list_boards(&self) {
        println!("Available boards:");
        for board in &self.sender.adj.boards {
            println!("  {} - {} ({} packets)", board.name, board.ip, board.packets.len());
        }
    }
    
    fn show_board_info(&self, board_name: &str) {
        if let Some(board) = self.sender.adj.boards.iter().find(|b| b.name == board_name) {
            println!("Board: {} (ID: {}, IP: {})", board.name, board.id, board.ip);
            println!("Packets ({}):", board.packets.len());
            
            println!("\nData packets:");
            for packet in board.get_data_packets() {
                println!("  [{}] {} ({} variables)", packet.id, packet.name, packet.variables.len());
            }
            
            println!("\nProtection packets:");
            for packet in board.get_protection_packets() {
                println!("  [{}] {} ({} variables)", packet.id, packet.name, packet.variables.len());
            }
        } else {
            println!("Board '{}' not found", board_name);
        }
    }
    
    async fn send_manual_packet(&self, board_name: &str) -> Result<()> {
        // Find the board
        let board = self.sender.adj.boards.iter()
            .find(|b| b.name == board_name)
            .ok_or_else(|| anyhow::anyhow!("Board '{}' not found", board_name))?;
        
        // Build packet interactively
        match ManualPacketBuilder::build_packet_interactive(board) {
            Ok(packet_data) => {
                // Send the packet
                match self.sender.send_raw_packet(board_name, packet_data).await {
                    Ok(_) => println!("\nPacket sent successfully!"),
                    Err(e) => println!("\nError sending packet: {}", e),
                }
            }
            Err(e) => println!("\nError building packet: {}", e),
        }
        
        Ok(())
    }
}
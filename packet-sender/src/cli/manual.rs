use anyhow::Result;
use std::io::{self, Write};
use crate::adj::{Board, Packet, Variable, ValueType};
use crate::generator::{encode_packet_header, encode_value};

pub struct ManualPacketBuilder;

impl ManualPacketBuilder {
    pub fn build_packet_interactive(board: &Board) -> Result<Vec<u8>> {
        // First, let user select a packet
        let packet = Self::select_packet(board)?;
        
        println!("\nSelected packet: {} (ID: {})", packet.name, packet.id);
        println!("This packet has {} variables", packet.variables.len());
        
        if packet.variables.is_empty() {
            // Empty packet, just return header
            return Ok(encode_packet_header(packet.id));
        }
        
        // Ask if user wants random or custom values
        let use_custom = Self::ask_random_or_custom()?;
        
        let mut packet_data = encode_packet_header(packet.id);
        
        if use_custom {
            // Get custom values for each variable
            for var in &packet.variables {
                let value = Self::get_custom_value(var)?;
                let encoded = encode_value(value, &var.value_type)?;
                packet_data.extend(encoded);
            }
        } else {
            // Generate random values
            use crate::generator::RandomValueGenerator;
            let generator = RandomValueGenerator::new();
            
            for var in &packet.variables {
                let value = generator.generate_for_variable(var)?;
                let encoded = encode_value(value, &var.value_type)?;
                packet_data.extend(encoded);
            }
        }
        
        Ok(packet_data)
    }
    
    fn select_packet(board: &Board) -> Result<&Packet> {
        println!("\nAvailable packets for board {}:", board.name);
        
        let mut all_packets = vec![];
        
        // Group by type
        let data_packets = board.get_data_packets();
        let protection_packets = board.get_protection_packets();
        let order_packets = board.get_order_packets();
        let info_packets = board.get_info_packets();
        
        if !data_packets.is_empty() {
            println!("\nData packets:");
            for packet in data_packets {
                let idx = all_packets.len();
                all_packets.push(packet);
                println!("  [{}] {} (ID: {}) - {} variables", 
                    idx + 1, packet.name, packet.id, packet.variables.len());
            }
        }
        
        if !protection_packets.is_empty() {
            println!("\nProtection packets:");
            for packet in protection_packets {
                let idx = all_packets.len();
                all_packets.push(packet);
                println!("  [{}] {} (ID: {}) - {} variables", 
                    idx + 1, packet.name, packet.id, packet.variables.len());
            }
        }
        
        if !order_packets.is_empty() {
            println!("\nOrder packets:");
            for packet in order_packets {
                let idx = all_packets.len();
                all_packets.push(packet);
                println!("  [{}] {} (ID: {}) - {} variables", 
                    idx + 1, packet.name, packet.id, packet.variables.len());
            }
        }
        
        if !info_packets.is_empty() {
            println!("\nInfo packets:");
            for packet in info_packets {
                let idx = all_packets.len();
                all_packets.push(packet);
                println!("  [{}] {} (ID: {}) - {} variables", 
                    idx + 1, packet.name, packet.id, packet.variables.len());
            }
        }
        
        loop {
            print!("\nSelect packet number (1-{}): ", all_packets.len());
            io::stdout().flush()?;
            
            let mut input = String::new();
            io::stdin().read_line(&mut input)?;
            
            if let Ok(num) = input.trim().parse::<usize>() {
                if num > 0 && num <= all_packets.len() {
                    return Ok(all_packets[num - 1]);
                }
            }
            
            println!("Invalid selection. Please enter a number between 1 and {}", all_packets.len());
        }
    }
    
    fn ask_random_or_custom() -> Result<bool> {
        loop {
            print!("\nGenerate (r)andom or (c)ustom values? ");
            io::stdout().flush()?;
            
            let mut input = String::new();
            io::stdin().read_line(&mut input)?;
            
            match input.trim().to_lowercase().as_str() {
                "r" | "random" => return Ok(false),
                "c" | "custom" => return Ok(true),
                _ => println!("Please enter 'r' for random or 'c' for custom"),
            }
        }
    }
    
    fn get_custom_value(var: &Variable) -> Result<f64> {
        println!("\nVariable: {} (ID: {})", var.name, var.id);
        println!("Type: {:?}", var.value_type);
        
        // Show units if available
        if let Some(ref units) = var.units {
            println!("Units: {}", units);
        }
        
        // Show safe/warning ranges if available
        if let Some(range) = &var.safe_range {
            if let (Some(min), Some(max)) = (&range[0], &range[1]) {
                println!("Safe range: {} to {}", min, max);
            }
        }
        if let Some(range) = &var.warning_range {
            if let (Some(min), Some(max)) = (&range[0], &range[1]) {
                println!("Warning range: {} to {}", min, max);
            }
        }
        
        // Show type-specific info
        match &var.value_type {
            ValueType::UInt8 => println!("Valid range: 0 to 255"),
            ValueType::UInt16 => println!("Valid range: 0 to 65535"),
            ValueType::UInt32 => println!("Valid range: 0 to 4294967295"),
            ValueType::UInt64 => println!("Valid range: 0 to 18446744073709551615"),
            ValueType::Int8 => println!("Valid range: -128 to 127"),
            ValueType::Int16 => println!("Valid range: -32768 to 32767"),
            ValueType::Int32 => println!("Valid range: -2147483648 to 2147483647"),
            ValueType::Int64 => println!("Valid range: -9223372036854775808 to 9223372036854775807"),
            ValueType::Float32 => println!("32-bit floating point"),
            ValueType::Float64 => println!("64-bit floating point"),
            ValueType::Bool => println!("Boolean: enter 0 for false, 1 for true"),
            ValueType::Enum(values) => {
                println!("Enum values:");
                for (i, val) in values.iter().enumerate() {
                    println!("  {} = {}", i, val);
                }
            }
            ValueType::String => println!("String type not supported for manual input"),
        }
        
        loop {
            print!("Enter value: ");
            io::stdout().flush()?;
            
            let mut input = String::new();
            io::stdin().read_line(&mut input)?;
            
            if let Ok(value) = input.trim().parse::<f64>() {
                // Validate value based on type
                match &var.value_type {
                    ValueType::UInt8 if value >= 0.0 && value <= 255.0 => return Ok(value),
                    ValueType::UInt16 if value >= 0.0 && value <= 65535.0 => return Ok(value),
                    ValueType::UInt32 if value >= 0.0 && value <= 4294967295.0 => return Ok(value),
                    ValueType::UInt64 if value >= 0.0 && value <= u64::MAX as f64 => return Ok(value),
                    ValueType::Int8 if value >= -128.0 && value <= 127.0 => return Ok(value),
                    ValueType::Int16 if value >= -32768.0 && value <= 32767.0 => return Ok(value),
                    ValueType::Int32 if value >= i32::MIN as f64 && value <= i32::MAX as f64 => return Ok(value),
                    ValueType::Int64 if value >= i64::MIN as f64 && value <= i64::MAX as f64 => return Ok(value),
                    ValueType::Float32 | ValueType::Float64 => return Ok(value),
                    ValueType::Bool if value == 0.0 || value == 1.0 => return Ok(value),
                    ValueType::Enum(values) if value >= 0.0 && (value as usize) < values.len() => return Ok(value),
                    _ => println!("Value out of range for type {:?}", var.value_type),
                }
            } else {
                println!("Invalid number format");
            }
        }
    }
}
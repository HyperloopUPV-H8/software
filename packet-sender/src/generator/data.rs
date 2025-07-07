use anyhow::Result;
use crate::adj::{Board, Packet, Variable};
use super::{encode_packet_header, encode_value, RandomValueGenerator};

#[derive(Clone)]
pub struct DataPacketGenerator {
    board: Board,
    random_gen: RandomValueGenerator,
}

impl DataPacketGenerator {
    pub fn new(board: Board) -> Self {
        Self {
            board,
            random_gen: RandomValueGenerator::new(),
        }
    }
    
    pub fn generate(&self, packet: &Packet) -> Result<Vec<u8>> {
        let mut buffer = encode_packet_header(packet.id);
        
        // Handle packets with no variables (like FAULT packet with ID 0)
        if packet.variables.is_empty() {
            return Ok(buffer);
        }
        
        for variable in &packet.variables {
            let value = self.random_gen.generate_for_variable(variable)?;
            let encoded = encode_value(value, &variable.value_type)?;
            buffer.extend_from_slice(&encoded);
        }
        
        Ok(buffer)
    }
    
    pub fn generate_sine_packet(&self, packet: &Packet, time: f64) -> Result<Vec<u8>> {
        let mut buffer = encode_packet_header(packet.id);
        
        // Handle packets with no variables
        if packet.variables.is_empty() {
            return Ok(buffer);
        }
        
        for (i, variable) in packet.variables.iter().enumerate() {
            let value = self.generate_sine_value(variable, time, i as f64)?;
            let encoded = encode_value(value, &variable.value_type)?;
            buffer.extend_from_slice(&encoded);
        }
        
        Ok(buffer)
    }
    
    fn generate_sine_value(&self, variable: &Variable, time: f64, offset: f64) -> Result<f64> {
        let frequency = 0.1 + offset * 0.05; // Different frequencies for each variable
        let phase = offset * std::f64::consts::PI / 4.0;
        let sine = (time * frequency * 2.0 * std::f64::consts::PI + phase).sin();
        
        // Map sine wave (-1 to 1) to variable range
        let normalized = (sine + 1.0) / 2.0; // 0 to 1
        
        if let Some(safe_range) = &variable.safe_range {
            if let (Some(min), Some(max)) = (safe_range[0], safe_range[1]) {
                return Ok(min + normalized * (max - min));
            }
        }
        
        // Fallback to type range
        Ok(normalized * variable.value_type.max_value())
    }
}
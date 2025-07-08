use anyhow::Result;
use rand::Rng;
use crate::adj::{Variable, ValueType};

#[derive(Clone)]
pub struct RandomValueGenerator;

impl RandomValueGenerator {
    pub fn new() -> Self {
        Self
    }
    
    pub fn generate_for_variable(&self, variable: &Variable) -> Result<f64> {
        let mut rng = rand::thread_rng();
        
        // Check if we have warning ranges to prefer
        if let Some(warning_range) = &variable.warning_range {
            if let (Some(min), Some(max)) = (warning_range[0], warning_range[1]) {
                // Generate values mostly within warning range with some variation
                let range = max - min;
                let extended_min = min - range * 0.2;
                let extended_max = max + range * 0.2;
                
                // 80% chance to be within warning range
                if rng.gen_bool(0.8) {
                    // Add small epsilon to avoid potential float precision issues
                    return Ok(rng.gen_range(min..max + f64::EPSILON));
                } else {
                    return Ok(rng.gen_range(extended_min..extended_max + f64::EPSILON));
                }
            }
        }
        
        // Check safe range
        if let Some(safe_range) = &variable.safe_range {
            if let (Some(min), Some(max)) = (safe_range[0], safe_range[1]) {
                return Ok(rng.gen_range(min..max + f64::EPSILON));
            }
        }
        
        // Fallback to type-based generation
        self.generate_for_type(&variable.value_type)
    }
    
    pub fn generate_for_type(&self, value_type: &ValueType) -> Result<f64> {
        let mut rng = rand::thread_rng();
        let value = match value_type {
            ValueType::Bool => {
                if rng.gen_bool(0.5) { 1.0 } else { 0.0 }
            }
            ValueType::Enum(variants) => {
                rng.gen_range(0..variants.len()) as f64
            }
            _ => {
                // For numeric types, generate a value between 0 and max
                let max = value_type.max_value();
                // Use exclusive range to avoid overflow with f64::MAX
                rng.gen_range(0.0..max)
            }
        };
        
        Ok(value)
    }
    
    pub fn generate_fault_value(&self) -> f64 {
        // Generate values that are likely to trigger faults
        if rand::thread_rng().gen_bool(0.5) {
            // Very high value
            f64::MAX * 0.9
        } else {
            // Very low value (potentially negative for signed types)
            -f64::MAX * 0.9
        }
    }
}
//! Componentes reutilizables de Hyperloop UPV.

pub mod hello_world;

/// # Git module
/// Handles updates and changes within the ADJ.  
/// Checks the ADJ Github repository and 
#[cfg(feature = "git")]
pub mod git;
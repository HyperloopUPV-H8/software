//! Blocking Git helpers for ADJ, an application-owned, replaceable data cache.

mod clone;
mod repository;
mod update;

pub use clone::CloneError;
pub use repository::{RepositoryError, branch_exists, list_remote_branches, open_repo};
pub use update::update_adj;

/// Errors produced while reading, downloading, or replacing the ADJ cache.
///
/// Five categories identify the failed operation and preserve its underlying
/// error as [`std::error::Error::source`]. [`RepositoryError`] and [`CloneError`]
/// retain concrete `gix` causes and are boxed to keep this enum small. Only
/// [`RepositoryError::ReferenceItem`] uses a dynamically typed cause, as exposed
/// by the `gix` iterator.
///
/// A failed connectivity probe is not itself an error when cached ADJ exists.
/// If no cache exists, the operation returns [`GitError::UnavailableOffline`].
#[derive(Debug, thiserror::Error)]
pub enum GitError {
    /// Resolving, inspecting, or preparing the cache directory failed.
    #[error("ADJ path operation failed: {0}")]
    Path(#[source] std::io::Error),

    /// Opening the repository or reading its references or HEAD failed.
    /// An absent reference is not itself an error.
    #[error("ADJ repository operation failed: {0}")]
    Repository(#[source] Box<RepositoryError>),

    /// Preparing, downloading, or checking out the requested branch failed.
    ///
    /// This can indicate a network, configuration, or remote-reference failure;
    /// it does not necessarily mean that internet connectivity is unavailable.
    #[error("ADJ clone failed: {0}")]
    Clone(#[source] Box<CloneError>),

    /// Moving the old cache aside or installing the new checkout failed.
    ///
    /// When restoration also fails, `rollback` holds its error and the preserved
    /// backup's location. Otherwise, the old cache was restored or never moved.
    #[error(
        "ADJ cache replacement failed: {source}{recovery}",
        recovery = .rollback.as_ref().map(|(error, path)| {
            format!("; rollback failed: {error}; backup kept at {}", path.display())
        }).unwrap_or_default()
    )]
    Replacement {
        /// The original error moving the old cache or installing the new checkout.
        #[source]
        source: std::io::Error,
        /// Restoration error and preserved backup path, if rollback failed.
        rollback: Option<(std::io::Error, std::path::PathBuf)>,
    },

    /// The connectivity probe failed and no local ADJ cache was available.
    #[error("ADJ is not available locally and cannot be downloaded")]
    UnavailableOffline,
}

// Convert repository errors for '?' propagation, boxing the concrete error to keep GitError small.
impl From<RepositoryError> for GitError {
    fn from(error: RepositoryError) -> Self {
        Self::Repository(Box::new(error))
    }
}

// Convert clone errors for '?' propagation, boxing the concrete error to keep GitError small.
impl From<CloneError> for GitError {
    fn from(error: CloneError) -> Self {
        Self::Clone(Box::new(error))
    }
}

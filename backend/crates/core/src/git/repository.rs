use super::{GitError, update::unwrap_repo_path};
use gix::Repository;
use std::path::PathBuf;
use tracing::{debug, instrument};

/// Concrete repository failures wrapped by [`GitError::Repository`].
///
/// Variants identify the failed read operation and preserve the original `gix`
/// error as their source. Only [`RepositoryError::ReferenceItem`] has a dynamic
/// source because the reference iterator returns boxed errors.
#[derive(Debug, thiserror::Error)]
pub enum RepositoryError {
    /// An existing repository could not be opened or validated.
    #[error("repository could not be opened: {0}")]
    Open(#[from] gix::open::Error),

    /// HEAD could not be resolved to a commit ID, including an unborn HEAD.
    #[error("HEAD could not be resolved: {0}")]
    Head(#[from] gix::reference::head_id::Error),

    /// The repository's reference storage could not be opened.
    #[error("reference storage could not be opened: {0}")]
    References(#[from] gix::reference::iter::Error),

    /// Iteration over cached remote-tracking references could not be initialized.
    #[error("reference iteration could not be initialized: {0}")]
    InitReferences(#[from] gix::reference::iter::init::Error),

    /// An individual reference could not be read during iteration.
    /// The boxed source retains its original type and error chain.
    #[error("reference could not be read: {0}")]
    ReferenceItem(#[from] Box<dyn std::error::Error + Send + Sync>),

    /// Looking up a reference failed; an absent reference is not an error.
    #[error("reference lookup failed: {0}")]
    FindReference(#[from] gix::reference::find::Error),
}

/// Opens an existing repository without fetching or changing its checkout.
///
/// `path` is the repository directory. If omitted, it defaults to
/// `<cache directory>/hyperloop-control-station/adj`. This does not create ADJ.
///
/// # Errors
///
/// Returns [`GitError::Path`] if the cache directory cannot be resolved, or
/// [`GitError::Repository`] if the repository is missing, invalid, or inaccessible.
#[instrument(level = "debug", err(level = "warn"))]
pub fn open_repo(path: Option<PathBuf>) -> Result<Repository, GitError> {
    let path = unwrap_repo_path(path)?;

    let repo = gix::open(path).map_err(RepositoryError::from)?;

    debug!(git_dir = ?repo.path(), "opened repository");
    Ok(repo)
}

/// Lists locally cached remote-tracking branches without contacting the remote.
///
/// `path` identifies the repository directory. Names retain the remote prefix,
/// such as `origin/main`; the results can be stale, are not explicitly sorted,
/// and may include symbolic references such as `origin/HEAD`.
///
/// # Errors
///
/// Returns [`GitError::Repository`] if the repository cannot be opened or its
/// references cannot be read.
#[instrument(level = "debug", err(level = "warn"))]
pub fn list_remote_branches(path: PathBuf) -> Result<Vec<String>, GitError> {
    let repo = gix::open(&path).map_err(RepositoryError::from)?;

    let mut branches = Vec::new();

    // Inspect local remote-tracking refs, not the remote server's advertised refs.
    for reference in repo
        .references()
        .map_err(RepositoryError::from)?
        .remote_branches()
        .map_err(RepositoryError::from)?
    {
        let reference = reference.map_err(RepositoryError::from)?;
        branches.push(reference.name().shorten().to_string());
    }

    debug!(
        ?path,
        count = branches.len(),
        "listed cached remote-tracking branches"
    );
    Ok(branches)
}

/// Checks whether a remote-tracking branch is cached in `repo`.
///
/// `remote` is the remote name, such as `origin`; `name` is the branch name, such
/// as `main` or `feature/example`. Looks up `refs/remotes/<remote>/<name>` without
/// contacting the server or checking local branches. `false` means the reference
/// is absent locally, not necessarily that the branch is absent on the server.
///
/// # Errors
///
/// Returns [`GitError::Repository`] if the reference name is invalid or the
/// reference cannot be read. A missing reference returns `Ok(false)`.
#[instrument(level = "debug", skip(repo), err(level = "warn"))]
pub fn branch_exists(repo: &gix::Repository, remote: &str, name: &str) -> Result<bool, GitError> {
    let full = format!("refs/remotes/{remote}/{name}");
    let exists = repo
        .try_find_reference(full.as_str())
        .map_err(RepositoryError::from)?
        .is_some();
    debug!(reference = %full, exists, "checked cached remote-tracking branch");
    Ok(exists)
}

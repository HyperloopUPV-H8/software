//! Blocking Git helpers for ADJ, an application-owned, replaceable data cache.

use std::{
    fs, io,
    net::{Ipv4Addr, SocketAddr, TcpStream},
    path::{Path, PathBuf},
    sync::atomic::AtomicBool,
    time::Duration,
};

use gix::Repository;
use tracing::{debug, info, instrument, warn};

type BoxError = Box<dyn std::error::Error + Send + Sync>;

const ADJ_URL: &str = "https://github.com/HyperloopUPV/adj.git";
const GIT_REMOTE: &str = "origin";

/// Downloads the requested ADJ branch, replacing the application-managed cache.
///
/// `path` is the repository directory, not its parent. If omitted, it defaults to
/// `<cache directory>/hyperloop-control-station/adj`. `branch` selects the branch
/// to clone when the connectivity probe succeeds.
///
/// Online, local edits and commits are discarded only after a fresh checkout
/// succeeds. Offline, the current cached checkout is used without switching
/// branches, so it may differ from `branch`. Returns its full commit hash and
/// commit message, in that order.
///
/// This performs blocking network and filesystem operations. Call during startup,
/// before readers use ADJ, with only one updater at a time. Replacement uses two
/// renames and is not atomic across a process crash.
///
/// # Errors
///
/// Returns an error if ADJ is missing offline, the path or repository is invalid
/// or inaccessible, cloning or checkout fails, or replacement fails. Clone errors
/// do not automatically fall back to the cache. If rollback fails, the error
/// includes the preserved backup's location.
#[instrument(level = "debug", err(level = "warn"))]
pub fn update_adj(path: Option<PathBuf>, branch: &str) -> Result<(String, String), BoxError> {
    let (repo, dir) = adj_exists_repo(path)?;

    if check_internet_connection() {
        info!(path = ?dir, branch, "starting ADJ update");
        // Release repository handles before moving the existing cache directory.
        drop(repo);
        git_replace(&dir, branch, ADJ_URL)
    } else if let Some(repo) = repo {
        warn!(path = ?dir, requested_branch = branch,
            "connectivity probe failed; using cached ADJ without switching branches");
        get_hash_and_message(&repo)
    } else {
        Err(io::Error::new(
            io::ErrorKind::NotFound,
            "ADJ is not available locally and cannot be downloaded",
        )
        .into())
    }
}

/// Lists locally cached remote-tracking branches without contacting the remote.
///
/// `path` identifies the repository directory. Names retain the remote prefix,
/// such as `origin/main`; the results can be stale, are not explicitly sorted,
/// and may include symbolic references such as `origin/HEAD`.
///
/// # Errors
///
/// Returns an error if the repository cannot be opened or its references cannot
/// be read.
#[instrument(level = "debug", err(level = "warn"))]
pub fn list_remote_branches(path: PathBuf) -> Result<Vec<String>, BoxError> {
    let repo = gix::open(&path)?;

    let mut branches = Vec::new();

    // Inspect local remote-tracking refs, not the remote server's advertised refs.
    for reference in repo.references()?.remote_branches()? {
        let reference = reference?;
        branches.push(reference.name().shorten().to_string());
    }

    debug!(
        ?path,
        count = branches.len(),
        "listed cached remote-tracking branches"
    );
    Ok(branches)
}

/// Opens an existing repository without fetching or changing its checkout.
///
/// `path` is the repository directory. If omitted, it defaults to
/// `<cache directory>/hyperloop-control-station/adj`. This does not create ADJ.
///
/// # Errors
///
/// Returns an error if the cache directory cannot be resolved or the repository
/// is missing, invalid, or inaccessible.
#[instrument(level = "debug", err(level = "warn"))]
pub fn open_repo(path: Option<PathBuf>) -> Result<Repository, BoxError> {
    let path = unwrap_repo_path(path)?;

    let repo = gix::open(path)?;

    debug!(git_dir = ?repo.path(), "opened repository");
    Ok(repo)
}

// Checks external TCP connectivity with a three-second timeout, not GitHub availability.
#[instrument(level = "debug")]
fn check_internet_connection() -> bool {
    // Use a fixed IPv4 address to avoid a separate DNS lookup and its timeout.
    let address = SocketAddr::from((Ipv4Addr::new(1, 1, 1, 1), 443));
    let timeout = Duration::from_secs(3);

    // Attempt only the TCP handshake; no application data is sent.
    match TcpStream::connect_timeout(&address, timeout) {
        Ok(_stream) => {
            debug!(%address, "connectivity probe succeeded");
            true
        }
        Err(error) => {
            // Record why the probe failed without treating it as an application error.
            debug!(%address, %error, "connectivity probe failed");
            false
        }
    }
}

// Preserve explicit paths; otherwise use the platform's user cache directory.
fn unwrap_repo_path(path: Option<PathBuf>) -> Result<PathBuf, BoxError> {
    let dir = match path {
        Some(path) => path,
        None => {
            let path = dirs::cache_dir().ok_or_else(|| {
                io::Error::new(io::ErrorKind::NotFound, "cache directory not found")
            })?;

            path.join("hyperloop-control-station").join("adj")
        }
    };

    debug!(path = ?dir, "resolved ADJ repository path");
    Ok(dir)
}

// Only an absent directory is a cache miss; invalid repositories remain errors.
fn adj_exists_repo(path: Option<PathBuf>) -> Result<(Option<Repository>, PathBuf), BoxError> {
    let dir = unwrap_repo_path(path)?;

    let res = if dir.try_exists()? {
        Some(gix::open(&dir)?)
    } else {
        None
    };

    debug!(path = ?dir, exists = res.is_some(), "checked local ADJ repository");
    Ok((res, dir))
}

// Stage beside ADJ so both installation and rollback use same-filesystem renames.
#[instrument(level = "debug", skip(url))]
fn git_replace(path: &Path, branch: &str, url: &str) -> Result<(String, String), BoxError> {
    let parent = path
        .parent()
        .filter(|p| !p.as_os_str().is_empty())
        .unwrap_or(Path::new("."));
    fs::create_dir_all(parent)?;
    let staging = tempfile::Builder::new()
        .prefix(".adj-")
        .tempdir_in(parent)?;
    let checkout = staging.path().join("new");
    let backup = staging.path().join("old");
    debug!(?checkout, ?backup, "created ADJ staging directory");

    // Validate the new checkout and commit before touching the current cache.
    // Early errors drop the staging directory, removing any incomplete clone.
    let repo = git_clone(&checkout, branch, url)?;
    let commit = get_hash_and_message(&repo)?;
    // The repository contains paths into staging and must not survive the move.
    drop(repo);

    let had_cache = path.try_exists()?;
    if had_cache {
        fs::rename(path, &backup)?;
        debug!(?path, ?backup, "moved cached ADJ aside for replacement");
    }
    if let Err(error) = fs::rename(&checkout, path) {
        debug!(?path, %error, had_cache, "ADJ installation failed; restoring cache if present");
        if had_cache && let Err(rollback) = fs::rename(&backup, path) {
            // Do not let temporary-directory cleanup delete the only remaining cache.
            let saved = staging.keep();
            debug!(?backup, %rollback, "preserved ADJ backup after failed rollback");
            return Err(io::Error::other(format!(
                "ADJ installation failed: {error}; rollback failed: {rollback}; backup kept at {}",
                saved.join("old").display()
            ))
            .into());
        }
        if had_cache {
            debug!(?path, "restored cached ADJ after installation failure");
        }
        return Err(error.into());
    }

    // Installation succeeded; cleanup now discards the old cache. A cleanup
    // failure does not turn a successfully installed checkout into an error.
    if let Err(error) = staging.close() {
        warn!(?path, %error, "ADJ updated, but temporary directory cleanup failed");
    }
    info!(?path, branch, commit = %commit.0, "ADJ updated");
    Ok(commit)
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
/// Returns an error if the reference name is invalid or the reference cannot be
/// read.
#[instrument(level = "debug", skip(repo), err(level = "warn"))]
pub fn branch_exists(repo: &gix::Repository, remote: &str, name: &str) -> Result<bool, BoxError> {
    let full = format!("refs/remotes/{remote}/{name}");
    let exists = repo.try_find_reference(full.as_str())?.is_some();
    debug!(reference = %full, exists, "checked cached remote-tracking branch");
    Ok(exists)
}

// Fetch and check out the requested branch instead of switching an existing repo.
#[instrument(level = "debug", skip(url))]
fn git_clone(path: &Path, branch: &str, url: &str) -> Result<Repository, BoxError> {
    // These synchronous startup operations do not currently expose cancellation.
    let interrupt = AtomicBool::new(false);

    debug!(?path, branch, "preparing shallow ADJ clone");
    // A depth of one keeps the current snapshot without downloading full history.
    let mut prepare = gix::prepare_clone(url, path)?
        .with_remote_name(GIT_REMOTE)?
        .with_ref_name(Some(branch))?
        .with_shallow(gix::remote::fetch::Shallow::DepthAtRemote(
            std::num::NonZeroU32::MIN,
        ));

    let (mut checkout, _) = prepare.fetch_then_checkout(gix::progress::Discard, &interrupt)?;
    debug!(
        ?path,
        branch, "ADJ fetch completed; checking out working tree"
    );
    let (repo, _) = checkout.main_worktree(gix::progress::Discard, &interrupt)?;

    debug!(?path, branch, "ADJ clone and checkout completed");
    Ok(repo)
}

// Report the checked-out HEAD, which can differ from the requested branch offline.
fn get_hash_and_message(repo: &Repository) -> Result<(String, String), BoxError> {
    let hash = repo.head_id()?.to_string();
    let message = repo.head_commit()?.decode()?.message.to_string();

    // Log only the commit ID, not potentially large or sensitive message text.
    debug!(commit = %hash, "read checked-out ADJ commit");
    Ok((hash, message))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::process::Command;

    fn git(path: &Path, args: &[&str]) -> Result<(), BoxError> {
        // Fixture commits need identity; disable signing, hooks, and templates
        // so tests do not depend on the user's normal Git setup.
        let output = Command::new("git")
            .current_dir(path)
            .args([
                "-c",
                "user.name=ADJ tests",
                "-c",
                "user.email=adj@example.test",
                "-c",
                "commit.gpgSign=false",
                "-c",
                "core.hooksPath=",
                "-c",
                "init.templateDir=",
            ])
            .args(args)
            .output()?;
        if !output.status.success() {
            return Err(io::Error::other(String::from_utf8_lossy(&output.stderr)).into());
        }
        Ok(())
    }

    fn source_repo(path: &Path) -> Result<(), BoxError> {
        fs::create_dir(path)?;
        git(path, &["init", "--initial-branch=main"])?;
        fs::write(path.join("data.txt"), "main")?;
        git(path, &["add", "."])?;
        git(path, &["commit", "-m", "main data"])?;
        // Leave HEAD on another branch to verify explicit clone branch selection.
        git(path, &["checkout", "-b", "testing"])?;
        fs::write(path.join("data.txt"), "testing")?;
        git(path, &["commit", "-am", "testing data"])
    }

    // Distinguish missing, invalid, and valid local repositories.
    #[test]
    fn detects_missing_and_invalid_repositories() -> Result<(), BoxError> {
        let temp = tempfile::tempdir()?;
        let path = temp.path().join("adj");
        assert!(adj_exists_repo(Some(path.clone()))?.0.is_none());
        fs::create_dir(&path)?;
        assert!(adj_exists_repo(Some(path.clone())).is_err());
        git(&path, &["init"])?;
        assert!(adj_exists_repo(Some(path))?.0.is_some());
        Ok(())
    }

    // Verify branch selection, newer commits, and removal of stale cache files.
    #[test]
    fn clones_and_replaces_with_requested_branch() -> Result<(), BoxError> {
        let temp = tempfile::tempdir()?;
        let source = temp.path().join("source");
        let cache = temp.path().join("cache").join("adj");
        source_repo(&source)?;
        let url = source.to_str().ok_or("non-UTF-8 test path")?;

        let first = git_replace(&cache, "main", url)?;
        assert_eq!(first.1, "main data\n");
        assert_eq!(fs::read_to_string(cache.join("data.txt"))?, "main");
        // Replacement must discard old cache files, not just update tracked ones.
        fs::write(cache.join("stale.txt"), "discard this cache file")?;

        // Add a newer remote commit and request a different branch on replacement.
        fs::write(source.join("data.txt"), "latest testing")?;
        git(&source, &["commit", "-am", "updated testing data"])?;
        let expected = get_hash_and_message(&gix::open(&source)?)?;
        assert_eq!(git_replace(&cache, "testing", url)?, expected);
        assert_ne!(first.0, expected.0);
        assert_eq!(get_hash_and_message(&gix::open(&cache)?)?, expected);
        assert_eq!(
            fs::read_to_string(cache.join("data.txt"))?,
            "latest testing"
        );
        assert!(!cache.join("stale.txt").exists());
        // Successful replacement must also remove staging and backup directories.
        assert_eq!(
            fs::read_dir(cache.parent().ok_or("missing parent")?)?.count(),
            1
        );
        Ok(())
    }

    // Verify clone failures preserve cached ADJ and leave no staging debris.
    #[test]
    fn failed_clone_preserves_existing_cache() -> Result<(), BoxError> {
        let temp = tempfile::tempdir()?;
        let source = temp.path().join("source");
        let cache = temp.path().join("adj");
        source_repo(&source)?;
        let url = source.to_str().ok_or("non-UTF-8 test path")?;

        // A failed first clone must not install a partial checkout.
        assert!(git_replace(&cache, "missing-branch", url).is_err());
        assert!(!cache.exists());
        let expected = git_replace(&cache, "main", url)?;
        fs::write(cache.join("stale.txt"), "keep on failure")?;
        // Both an invalid branch and an unavailable source must leave ADJ intact.
        assert!(git_replace(&cache, "missing-branch", url).is_err());
        let missing = temp.path().join("missing-source");
        assert!(
            git_replace(
                &cache,
                "main",
                missing.to_str().ok_or("non-UTF-8 test path")?
            )
            .is_err()
        );
        assert_eq!(get_hash_and_message(&gix::open(&cache)?)?, expected);
        assert_eq!(fs::read_to_string(cache.join("data.txt"))?, "main");
        assert_eq!(
            fs::read_to_string(cache.join("stale.txt"))?,
            "keep on failure"
        );
        assert_eq!(fs::read_dir(temp.path())?.count(), 2);
        Ok(())
    }
}

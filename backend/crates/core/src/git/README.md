# ADJ Git helpers

This module manages ADJ as an application-owned, replaceable data cache using
`gix`, with `tracing` for logging. It does not preserve local edits or commits
when updating online.

## Workflow

`update_adj(path, branch)` returns the checked-out commit hash and full message.
A custom path identifies the ADJ repository itself. The default is
`<cache directory>/hyperloop-control-station/adj`, using `dirs::cache_dir()`.
An existing invalid repository or inaccessible path returns an error.

The existing connectivity check attempts a TCP connection to `1.1.1.1:443`
with a three-second timeout. This checks external TCP connectivity, not GitHub
availability.

### Online

- Shallow-clone the requested branch into a temporary directory beside ADJ.
- Complete checkout and read its commit information before touching the cache.
- Move the old cache aside and install the new checkout.
- Restore the old cache if installation fails. If restoration also fails,
  preserve the backup and include its location in the error.
- Remove the old cache after successful installation.

A clone error leaves the old cache untouched and is returned directly; it does
not automatically fall back to offline operation. No fetch, merge, or branch
switch is needed because the checkout is replaced.

### Offline

- If ADJ exists, return its current commit without updating or switching branches.
- Otherwise, return `ADJ is not available locally and cannot be downloaded`.

The cached branch may differ from the requested branch when offline.

## Other Helpers

- `open_repo` opens the custom or default repository path.
- `list_remote_branches` lists cached remote-tracking references, without making
  a network request. Results can be stale and include the remote name.
- `branch_exists` checks for a cached `refs/remotes/<remote>/<branch>` reference.

## Limitations

Replacement is intended for startup, before the backend reads ADJ, with one
updater at a time. The backup and installation renames are not jointly atomic
across a process crash. The connectivity probe can succeed when GitHub is
unreachable, or fail when GitHub is reachable.

## Verification

Tests use temporary local Git repositories and the Git CLI to create fixtures;
they do not require external network access. Production Git operations use `gix`.

```bash
cargo test -p software-core -F git
cargo doc --open -p software-core -F git --no-deps
```

export const config = {
  /** GitHub repository whose branches are offered when resolving a commit for the ADJ Viewer. */
  ADJ_GITHUB_REPO: "hyperloop-upv/adj",

  /** Timeout for fetching branches from GitHub API. */
  BRANCHES_FETCH_TIMEOUT: 5000,
} as const;

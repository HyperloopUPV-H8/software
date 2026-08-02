// Standalone ADJ Viewer page: fetch an ADJ archive by commit hash and browse it.
// No session/store dependency — this app only ever knows what the user types in.
import {
  Badge,
  Button,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components";
import { BookOpen, GitCommit, Loader2, RefreshCw, SunMoon } from "@workspace/ui/icons";
import { useCallback, useEffect, useState } from "react";
import { config } from "../../config";
import { useBranches } from "../hooks/useBranches";
import type { AdjArchive } from "../types/adj";
import { AdjViewerTabs, extractBoards } from "./AdjViewerTabs";

const ADJ_ARCHIVE_URL = (hash: string) =>
  `https://hyperloop-upv.github.io/ADJ-Archive/storage/commit-${hash}.json`;

async function fetchAdjArchive(hash: string): Promise<AdjArchive> {
  const response = await fetch(ADJ_ARCHIVE_URL(hash));
  if (!response.ok) throw new Error(`ADJ fetch failed: ${response.status}`);
  return response.json();
}

async function resolveBranchToCommit(branch: string): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${config.ADJ_GITHUB_REPO}/branches/${encodeURIComponent(branch)}`,
  );
  if (!response.ok) throw new Error(`Branch lookup failed: ${response.status}`);
  const data = await response.json();
  return data.commit.sha as string;
}

interface AdjViewerPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function AdjViewerPage({ isDark, onToggleTheme }: AdjViewerPageProps) {
  const [hashInput, setHashInput] = useState("");
  const [commitHash, setCommitHash] = useState<string | null>(null);
  const [adjData, setAdjData] = useState<AdjArchive | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { branches, isLoading: branchesLoading, error: branchesError, refetch: refetchBranches } = useBranches(true);
  const [branchInput, setBranchInput] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [resolvingBranch, setResolvingBranch] = useState(false);

  const boards = adjData ? extractBoards(adjData) : [];
  const totalMeasurements = boards.reduce((s, b) => s + b.measurements.length, 0);
  const totalPackets = boards.reduce((s, b) => s + b.packets.length + b.orders.length, 0);

  const load = useCallback(async (hash: string) => {
    if (!hash) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdjArchive(hash);
      setAdjData(data);
      setCommitHash(hash);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoad = () => load(hashInput.trim());

  const handleBranchSelect = async (branch: string) => {
    if (!branch) return;
    try {
      setResolvingBranch(true);
      setError(null);
      const sha = await resolveBranchToCommit(branch);
      await load(sha);
    } catch (err) {
      setError(String(err));
    } finally {
      setResolvingBranch(false);
    }
  };

  // If launched from logging-view's "View ADJ" shortcut, the main process
  // passes the session's commit hash through as a query param — load it
  // immediately instead of waiting for the user to type it in.
  useEffect(() => {
    const commit = new URLSearchParams(window.location.search).get("commit");
    if (commit) {
      setHashInput(commit);
      load(commit);
    }
  }, [load]);

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <BookOpen className="text-primary size-5" />
        <h1 className="text-xl font-bold">ADJ Viewer</h1>
        {commitHash && (
          <span className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
            <GitCommit className="size-3" />
            {commitHash.slice(0, 7)}
          </span>
        )}
        {adjData && (
          <div className="text-muted-foreground flex gap-3 text-[11px]">
            <span><span className="text-foreground font-semibold">{boards.length}</span> boards</span>
            <span><span className="text-foreground font-semibold">{totalMeasurements}</span> measurements</span>
            <span><span className="text-foreground font-semibold">{totalPackets}</span> packets</span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Combobox
              items={branches}
              value={selectedBranch}
              onValueChange={(v) => {
                setSelectedBranch(v);
                setBranchInput(v ?? "");
                if (v) handleBranchSelect(v);
              }}
            >
              <ComboboxInput
                placeholder={branchesLoading ? "Loading branches…" : "Branch…"}
                value={branchInput}
                onChange={(e) => {
                  setBranchInput(e.target.value);
                  setSelectedBranch(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleBranchSelect(branchInput.trim());
                }}
                className="h-8 w-[10rem] text-xs"
              />
              <ComboboxContent>
                <ComboboxEmpty>No branches found</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Button
              variant="ghost"
              size="icon"
              onClick={refetchBranches}
              disabled={branchesLoading}
              title="Refetch branches"
              className={`size-8 ${branchesError ? "text-destructive hover:text-destructive" : ""}`}
            >
              {resolvingBranch ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className={`size-3.5 ${branchesLoading ? "animate-spin" : ""}`} />
              )}
            </Button>
          </div>

          <span className="text-muted-foreground text-[10px]">or</span>

          <Input
            placeholder="ADJ commit hash…"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLoad()}
            className="h-8 w-[16rem] font-mono text-xs"
          />
          <Button size="sm" onClick={handleLoad} disabled={loading || !hashInput.trim()}>
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Load"}
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Toggle theme">
                  <SunMoon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isDark ? "Switch to light mode" : "Switch to dark mode"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {error && (
        <Badge variant="destructive" className="w-fit">
          {error}
        </Badge>
      )}

      <div className="min-h-0 flex-1">
        {adjData ? (
          <AdjViewerTabs adjData={adjData} />
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-sm">
            <BookOpen className="size-8 opacity-20" />
            {loading ? "Loading archive…" : "Enter an ADJ commit hash to view its data."}
          </div>
        )}
      </div>
    </div>
  );
}

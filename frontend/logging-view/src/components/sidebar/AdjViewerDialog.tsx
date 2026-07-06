import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components";
import {
  Activity,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Cpu,
  ExternalLink,
  Network,
  Search,
  Server,
} from "@workspace/ui/icons";
import { cn, getTypeBadgeClass, typeBadgeClasses } from "@workspace/ui/lib";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../../store/store";
import type { AdjArchive, AdjMeasurement, AdjPacket } from "../../types/session";

// ─── types ───────────────────────────────────────────────────────────────────

type BoardMeta = {
  name: string;
  id: number;
  ip: string;
  measurements: AdjMeasurement[];
  packets: AdjPacket[];
  orders: AdjPacket[];
};

type SortKey = "board" | "name" | "type" | "units" | "id";
type SortDir = "asc" | "desc";

// ─── data helpers ─────────────────────────────────────────────────────────────

function extractBoards(adjData: AdjArchive): BoardMeta[] {
  return Object.entries(adjData.boards)
    .map(([boardName, boardGroup]) => {
      const g = boardGroup as Record<string, unknown>;
      const info = g[boardName] as { board_id: number; board_ip: string } | undefined;
      return {
        name: boardName,
        id: info?.board_id ?? 0,
        ip: info?.board_ip ?? "—",
        measurements: (g[`${boardName}_measurements`] as AdjMeasurement[] | undefined) ?? [],
        packets: (g["packets"] as AdjPacket[] | undefined) ?? [],
        orders: (g["orders"] as AdjPacket[] | undefined) ?? [],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function normalizeType(raw: string): keyof typeof typeBadgeClasses {
  const t = raw.toLowerCase();
  if (["float", "float32", "float64"].includes(t)) return "float";
  if (["int", "integer", "int8", "int16", "int32", "int64"].includes(t)) return "integer";
  if (["uint8", "uint16", "uint32", "uint64"].includes(t)) return "uint";
  if (["enum", "string"].includes(t)) return "enum";
  if (["bool", "boolean"].includes(t)) return "boolean";
  return "unknown";
}

function exportCSV(rows: { board: string; name: string; type?: string; displayUnits?: string; id: string }[], filename: string) {
  const header = ["Board", "Name", "Type", "Units", "ID"].join(",");
  const lines = rows.map((r) => [r.board, r.name, r.type ?? "", r.displayUnits ?? "", r.id].map((v) => `"${v}"`).join(","));
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── atom components ─────────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/25 text-foreground rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function ResultCount({ n, total }: { n: number; total: number }) {
  return (
    <span className="text-muted-foreground shrink-0 text-[11px]">
      {n === total ? total : `${n} / ${total}`}
    </span>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="relative flex-1">
      <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2" />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 pl-8 pr-8 text-xs shadow-none focus-visible:ring-0"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}

function SortableHeader({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (col: SortKey) => void;
}) {
  const active = sortKey === col;
  return (
    <th className="bg-background pb-2 pr-3 text-left">
      <button
        type="button"
        onClick={() => onSort(col)}
        className={cn(
          "inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {label}
        {active ? (
          sortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />
        ) : (
          <ChevronDown className="size-3 opacity-0 group-hover:opacity-40" />
        )}
      </button>
    </th>
  );
}

function TypeChip({
  type,
  active,
  count,
  onClick,
}: {
  type: keyof typeof typeBadgeClasses;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-all",
        active ? typeBadgeClasses[type] : "border-border text-muted-foreground opacity-40 hover:opacity-70",
      )}
    >
      {type}
      <span className="opacity-70">{count}</span>
    </button>
  );
}

function BoardChip({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border text-muted-foreground opacity-50 hover:opacity-80",
      )}
    >
      {name}
    </button>
  );
}

function FilterPills({
  activeBoards,
  activeTypes,
  onClearBoard,
  onClearType,
  onClearAll,
}: {
  activeBoards: Set<string>;
  activeTypes: Set<string>;
  onClearBoard: (b: string) => void;
  onClearType: (t: string) => void;
  onClearAll: () => void;
}) {
  if (activeBoards.size === 0 && activeTypes.size === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-muted-foreground text-[10px]">Filters:</span>
      {[...activeBoards].map((b) => (
        <span key={b} className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium">
          {b}
          <button type="button" onClick={() => onClearBoard(b)} className="hover:text-destructive leading-none">✕</button>
        </span>
      ))}
      {[...activeTypes].map((t) => (
        <span key={t} className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase", typeBadgeClasses[t as keyof typeof typeBadgeClasses])}>
          {t}
          <button type="button" onClick={() => onClearType(t)} className="hover:opacity-70 leading-none">✕</button>
        </span>
      ))}
      <button type="button" onClick={onClearAll} className="text-muted-foreground hover:text-destructive text-[10px] underline underline-offset-2">
        clear all
      </button>
    </div>
  );
}

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <button type="button" onClick={copy} title="Copy" className="text-muted-foreground hover:text-foreground font-mono text-xs transition-colors">
      {copied ? <span className="text-primary text-[10px]">✓ copied</span> : value}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-sm">
      <Search className="mb-2 size-8 opacity-20" />
      {text}
    </div>
  );
}

// ─── Boards tab ───────────────────────────────────────────────────────────────

function BoardsTab({
  boards,
  onJumpToMeasurements,
}: {
  boards: BoardMeta[];
  onJumpToMeasurements: (boardName: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardSearch(inputRef);

  const filtered = useMemo(
    () => boards.filter((b) => b.name.toLowerCase().includes(query.toLowerCase())),
    [boards, query],
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <SearchInput value={query} onChange={setQuery} placeholder="Filter boards… ( / )" inputRef={inputRef} />
        <ResultCount n={filtered.length} total={boards.length} />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {filtered.map((board) => {
          const expanded = expandedBoard === board.name;
          return (
            <div key={board.name} className="bg-muted/20 overflow-hidden rounded-lg border">
              {/* Header row */}
              <button
                type="button"
                onClick={() => setExpandedBoard(expanded ? null : board.name)}
                className="hover:bg-muted/30 flex w-full items-center gap-2 p-3 text-left transition-colors"
              >
                {expanded ? <ChevronDown className="text-muted-foreground size-3.5 shrink-0" /> : <ChevronRight className="text-muted-foreground size-3.5 shrink-0" />}
                <Cpu className="text-primary size-4 shrink-0" />
                <span className="font-semibold">{board.name}</span>
                <Badge variant="secondary" className="ml-auto font-mono text-[10px]">ID {board.id}</Badge>
                <Badge variant="outline" className="font-mono text-[10px]">{board.ip}</Badge>
              </button>

              {/* Stats row */}
              <div className="border-t px-3 py-2">
                <div className="text-muted-foreground flex items-center gap-4 text-[11px]">
                  <span><span className="text-foreground font-semibold">{board.measurements.length}</span> measurements</span>
                  <span><span className="text-foreground font-semibold">{board.packets.length}</span> packets</span>
                  <span><span className="text-foreground font-semibold">{board.orders.length}</span> orders</span>
                  <button
                    type="button"
                    onClick={() => onJumpToMeasurements(board.name)}
                    className="text-primary ml-auto flex items-center gap-1 text-[10px] hover:underline"
                  >
                    View measurements <ExternalLink className="size-2.5" />
                  </button>
                </div>
              </div>

              {/* Expanded: measurements list */}
              {expanded && board.measurements.length > 0 && (
                <div className="border-t">
                  {board.measurements.slice(0, 30).map((m) => (
                    <div key={m.id} className="hover:bg-muted/30 flex items-center gap-2 border-b px-3 py-1.5 text-xs last:border-0">
                      <span className="min-w-0 flex-1 truncate font-medium">{m.name}</span>
                      {m.type && (
                        <Badge variant="secondary" className={cn("shrink-0 rounded px-1 text-[9px] font-bold uppercase leading-none", getTypeBadgeClass(m.type))}>
                          {m.type}
                        </Badge>
                      )}
                      {m.displayUnits && <span className="text-muted-foreground shrink-0 text-[10px]">{m.displayUnits}</span>}
                      <span className="text-muted-foreground shrink-0 font-mono text-[10px]">{m.id}</span>
                    </div>
                  ))}
                  {board.measurements.length > 30 && (
                    <div className="text-muted-foreground px-3 py-1.5 text-[10px]">
                      +{board.measurements.length - 30} more — use Measurements tab
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <EmptyState text="No boards match." />}
      </div>
    </div>
  );
}

// ─── Measurements tab ─────────────────────────────────────────────────────────

function MeasurementsTab({
  boards,
  initialBoardFilter,
}: {
  boards: BoardMeta[];
  initialBoardFilter: Set<string>;
}) {
  const [query, setQuery] = useState("");
  const [activeBoards, setActiveBoards] = useState<Set<string>>(initialBoardFilter);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardSearch(inputRef);

  const allRows = useMemo(
    () => boards.flatMap((b) => b.measurements.map((m) => ({ board: b.name, ...m }))),
    [boards],
  );

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<keyof typeof typeBadgeClasses, number>> = {};
    for (const r of allRows) {
      const t = normalizeType(r.type ?? "");
      counts[t] = (counts[t] ?? 0) + 1;
    }
    return counts;
  }, [allRows]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allRows
      .filter((r) => {
        if (activeBoards.size > 0 && !activeBoards.has(r.board)) return false;
        if (activeTypes.size > 0 && !activeTypes.has(normalizeType(r.type ?? ""))) return false;
        if (q && !r.name.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !r.board.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        const va = (sortKey === "units" ? (a.displayUnits ?? "") : sortKey === "type" ? (a.type ?? "") : String(a[sortKey as keyof typeof a] ?? "")).toLowerCase();
        const vb = (sortKey === "units" ? (b.displayUnits ?? "") : sortKey === "type" ? (b.type ?? "") : String(b[sortKey as keyof typeof b] ?? "")).toLowerCase();
        return va.localeCompare(vb) * dir;
      });
  }, [allRows, query, activeBoards, activeTypes, sortKey, sortDir]);

  const toggleBoard = (name: string) =>
    setActiveBoards((s) => { const n = new Set(s); if (n.has(name)) n.delete(name); else n.add(name); return n; });

  const toggleType = (t: string) =>
    setActiveTypes((s) => { const n = new Set(s); if (n.has(t)) n.delete(t); else n.add(t); return n; });

  const handleSort = (col: SortKey) => {
    if (sortKey === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(col); setSortDir("asc"); }
  };

  const q = query.toLowerCase();

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Search + export */}
      <div className="flex items-center gap-2">
        <SearchInput value={query} onChange={setQuery} placeholder="Search name, ID, board… ( / )" inputRef={inputRef} />
        <ResultCount n={filtered.length} total={allRows.length} />
        <button
          type="button"
          onClick={() => exportCSV(filtered, "measurements.csv")}
          className="text-muted-foreground hover:text-foreground shrink-0 text-[11px] underline underline-offset-2 transition-colors"
        >
          CSV
        </button>
      </div>

      {/* Board chips */}
      <div className="flex flex-wrap gap-1.5">
        {boards.map((b) => (
          <BoardChip key={b.name} name={b.name} active={activeBoards.has(b.name)} onClick={() => toggleBoard(b.name)} />
        ))}
      </div>

      {/* Type chips */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(typeBadgeClasses) as (keyof typeof typeBadgeClasses)[])
          .filter((t) => (typeCounts[t] ?? 0) > 0)
          .map((t) => (
            <TypeChip key={t} type={t} active={activeTypes.has(t)} count={typeCounts[t] ?? 0} onClick={() => toggleType(t)} />
          ))}
      </div>

      {/* Active filter pills */}
      <FilterPills
        activeBoards={activeBoards}
        activeTypes={activeTypes}
        onClearBoard={toggleBoard}
        onClearType={toggleType}
        onClearAll={() => { setActiveBoards(new Set()); setActiveTypes(new Set()); }}
      />

      {/* Table */}
      <div className="flex-1 overflow-auto pr-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 shadow-sm">
            <tr className="border-b">
              <SortableHeader label="Board" col="board" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Name"  col="name"  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Type"  col="type"  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Units" col="units" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="ID"    col="id"    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const rowKey = `${r.board}/${r.id}`;
              const expanded = expandedId === rowKey;
              const isEnum = r.type === "enum";
              return (
                <>
                  <tr
                    key={rowKey}
                    onClick={() => setExpandedId(expanded ? null : rowKey)}
                    className={cn(
                      "border-b transition-colors",
                      (isEnum || r.podUnits) ? "cursor-pointer hover:bg-muted/30" : "hover:bg-muted/20",
                      expanded && "bg-muted/20",
                    )}
                  >
                    <td className="text-muted-foreground py-2 pr-3 font-mono">
                      <Highlight text={r.board} query={q} />
                    </td>
                    <td className="py-2 pr-3 font-medium">
                      <div className="flex items-center gap-1">
                        <Highlight text={r.name} query={q} />
                        {(isEnum || r.podUnits) && (
                          <ChevronDown className={cn("text-muted-foreground size-3 shrink-0 transition-transform", expanded && "rotate-180")} />
                        )}
                      </div>
                    </td>
                    <td className="py-2 pr-3">
                      {r.type && (
                        <Badge variant="secondary" className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none", getTypeBadgeClass(r.type))}>
                          {r.type}
                        </Badge>
                      )}
                    </td>
                    <td className="text-muted-foreground py-2 pr-3">{r.displayUnits ?? "—"}</td>
                    <td className="text-muted-foreground py-2 font-mono text-[10px]">
                      <Highlight text={r.id} query={q} />
                    </td>
                  </tr>
                  {expanded && (
                    <tr key={`${rowKey}-detail`} className="bg-muted/10">
                      <td colSpan={5} className="px-3 pb-3 pt-1">
                        <div className="space-y-1.5 text-[11px]">
                          {r.podUnits && (
                            <p className="text-muted-foreground">
                              Pod units: <span className="text-foreground font-mono">{r.podUnits}</span>
                              {r.displayUnits && r.displayUnits !== r.podUnits && (
                                <> → <span className="text-foreground font-mono">{r.displayUnits}</span></>
                              )}
                            </p>
                          )}
                          {isEnum && r.enumValues && r.enumValues.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {r.enumValues.map((v, i) => (
                                <span key={v} className="bg-violet-500/10 text-violet-400 border-violet-500/30 rounded border px-1.5 py-0.5 font-mono text-[10px]">
                                  {i}: {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState text="No measurements match the current filters." />}
      </div>
    </div>
  );
}

// ─── Packets tab ──────────────────────────────────────────────────────────────

function PacketsTab({ boards }: { boards: BoardMeta[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"packets" | "orders">("packets");
  const [activeBoards, setActiveBoards] = useState<Set<string>>(new Set());
  const [sortByPeriod, setSortByPeriod] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardSearch(inputRef);

  const allRows = useMemo(
    () => boards.flatMap((b) => (kind === "packets" ? b.packets : b.orders).map((p) => ({ board: b.name, ...p }))),
    [boards, kind],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allRows
      .filter((r) => {
        if (activeBoards.size > 0 && !activeBoards.has(r.board)) return false;
        if (q && !r.name.toLowerCase().includes(q) && !r.board.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortByPeriod) return (a.period ?? Infinity) - (b.period ?? Infinity);
        return a.name.localeCompare(b.name);
      });
  }, [allRows, query, activeBoards, sortByPeriod]);

  const toggleBoard = (name: string) =>
    setActiveBoards((s) => { const n = new Set(s); if (n.has(name)) n.delete(name); else n.add(name); return n; });

  const q = query.toLowerCase();

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <SearchInput value={query} onChange={setQuery} placeholder={`Search ${kind}… ( / )`} inputRef={inputRef} />
        <div className="flex shrink-0 overflow-hidden rounded-md border text-[11px]">
          {(["packets", "orders"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => { setKind(k); setQuery(""); setActiveBoards(new Set()); }}
              className={cn("px-3 py-1.5 capitalize transition-colors", kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
            >
              {k}
            </button>
          ))}
        </div>
        <ResultCount n={filtered.length} total={allRows.length} />
      </div>

      {/* Board chips + sort toggle */}
      <div className="flex flex-wrap items-center gap-1.5">
        {boards.map((b) => (
          <BoardChip key={b.name} name={b.name} active={activeBoards.has(b.name)} onClick={() => toggleBoard(b.name)} />
        ))}
        <button
          type="button"
          onClick={() => setSortByPeriod((v) => !v)}
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] transition-colors",
            sortByPeriod ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:opacity-80",
          )}
        >
          Sort by period
        </button>
      </div>

      {/* Active filter pills */}
      <FilterPills
        activeBoards={activeBoards}
        activeTypes={new Set()}
        onClearBoard={toggleBoard}
        onClearType={() => {}}
        onClearAll={() => setActiveBoards(new Set())}
      />

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {filtered.map((r, i) => (
          <div key={i} className="bg-muted/20 rounded-lg border px-3 py-2">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="font-semibold"><Highlight text={r.name} query={q} /></span>
              <Badge variant="secondary" className="font-mono text-[10px]">ID {r.id}</Badge>
              {r.period != null && (
                <Badge variant="outline" className="font-mono text-[10px]">{r.period} {r.period_type}</Badge>
              )}
              {r.socket && (
                <Badge variant="outline" className="font-mono text-[10px]">{r.socket}</Badge>
              )}
              <span className="text-muted-foreground ml-auto font-mono text-[10px]">
                <Highlight text={r.board} query={q} />
              </span>
            </div>
            {r.variables && r.variables.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {r.variables.map((v) => (
                  <span key={v} className="bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]">{v}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <EmptyState text={`No ${kind} match the current filters.`} />}
      </div>
    </div>
  );
}

// ─── General tab ─────────────────────────────────────────────────────────────

function GeneralSection({
  title,
  data,
  query,
}: {
  title: string;
  data: Record<string, string | number>;
  query: string;
}) {
  const entries = Object.entries(data).filter(
    ([k, v]) => !query || k.toLowerCase().includes(query) || String(v).toLowerCase().includes(query),
  );
  if (entries.length === 0) return null;
  return (
    <div>
      <h3 className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-widest">
        {title} <span className="opacity-50">({entries.length})</span>
      </h3>
      <div className="bg-muted/20 divide-y rounded-lg border">
        {entries.map(([k, v]) => (
          <div key={k} className="hover:bg-muted/30 flex items-center gap-2 px-3 py-1.5 transition-colors">
            <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">{k}</span>
            <CopyValue value={String(v)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneralTab({ adjData }: { adjData: AdjArchive }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useKeyboardSearch(inputRef);
  const q = query.toLowerCase();
  const { ports, addresses, units, message_ids } = adjData.general_info;

  return (
    <div className="flex h-full flex-col gap-3">
      {/* wrap in a row so flex-1 on SearchInput grows horizontally, not vertically */}
      <div className="flex shrink-0 items-center">
        <SearchInput value={query} onChange={setQuery} placeholder="Filter keys or values… ( / )" inputRef={inputRef} />
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        <GeneralSection title="Ports" data={ports} query={q} />
        <GeneralSection title="Addresses" data={addresses} query={q} />
        <GeneralSection title="Units" data={units} query={q} />
        <GeneralSection title="Message IDs" data={message_ids} query={q} />
      </div>
    </div>
  );
}

// ─── hook: / key focuses the nearest search input ─────────────────────────────

function useKeyboardSearch(ref: React.RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [ref]);
}

// ─── main dialog ─────────────────────────────────────────────────────────────

interface AdjViewerDialogProps {
  children: React.ReactNode;
}

export const AdjViewerDialog = ({ children }: AdjViewerDialogProps) => {
  const adjData = useStore((s) => s.adjData);
  const settings = useStore((s) => s.settings);

  const boards = useMemo(() => (adjData ? extractBoards(adjData) : []), [adjData]);

  // Lifted state for cross-tab navigation
  const [activeTab, setActiveTab] = useState("boards");
  const [jumpBoardFilter, setJumpBoardFilter] = useState<Set<string>>(new Set());

  const handleJumpToMeasurements = useCallback((boardName: string) => {
    setJumpBoardFilter(new Set([boardName]));
    setActiveTab("measurements");
  }, []);

  const totalMeasurements = boards.reduce((s, b) => s + b.measurements.length, 0);
  const totalPackets = boards.reduce((s, b) => s + b.packets.length + b.orders.length, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* sm:max-w-4xl overrides default sm:max-w-lg; flex flex-col overrides grid */}
      <DialogContent className="flex h-[85vh] flex-col gap-0 p-0 sm:max-w-4xl">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <BookOpen className="text-primary size-4" />
            ADJ Viewer
            {settings && (
              <span className="text-muted-foreground font-mono text-xs font-normal">
                {settings.adj_commit_hash.slice(0, 7)}
              </span>
            )}
            {adjData && (
              <div className="text-muted-foreground ml-auto flex gap-3 pr-6 text-[11px] font-normal">
                <span><span className="text-foreground font-semibold">{boards.length}</span> boards</span>
                <span><span className="text-foreground font-semibold">{totalMeasurements}</span> measurements</span>
                <span><span className="text-foreground font-semibold">{totalPackets}</span> packets</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {adjData ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col gap-0 px-6 pt-4">
            <TabsList className="mb-4 w-fit shrink-0">
              <TabsTrigger value="boards" className="gap-1.5 text-xs">
                <Cpu className="size-3.5" /> Boards
              </TabsTrigger>
              <TabsTrigger value="measurements" className="gap-1.5 text-xs">
                <Activity className="size-3.5" /> Measurements
              </TabsTrigger>
              <TabsTrigger value="packets" className="gap-1.5 text-xs">
                <Network className="size-3.5" /> Packets
              </TabsTrigger>
              <TabsTrigger value="general" className="gap-1.5 text-xs">
                <Server className="size-3.5" /> General
              </TabsTrigger>
            </TabsList>

            <TabsContent value="boards" className="min-h-0 flex-1 overflow-hidden pb-4">
              <BoardsTab boards={boards} onJumpToMeasurements={handleJumpToMeasurements} />
            </TabsContent>
            {/* key remounts MeasurementsTab on cross-tab jump so initialBoardFilter takes effect cleanly */}
            <TabsContent value="measurements" className="min-h-0 flex-1 overflow-hidden pb-4">
              <MeasurementsTab key={[...jumpBoardFilter].join(",")} boards={boards} initialBoardFilter={jumpBoardFilter} />
            </TabsContent>
            <TabsContent value="packets" className="min-h-0 flex-1 overflow-hidden pb-4">
              <PacketsTab boards={boards} />
            </TabsContent>
            <TabsContent value="general" className="min-h-0 flex-1 overflow-hidden pb-4">
              <GeneralTab adjData={adjData} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
            No session loaded.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

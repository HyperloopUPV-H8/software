// Reusable signal picker: session series grouped by board, composed signals
// (operations / transforms) in their own group with ∑ / 𝑓 glyphs.
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components";
import { useAvailableSignals, type AvailableSignal } from "./hooks/useStudioSignals";

interface SignalSelectProps {
  value: string;
  onValueChange: (id: string) => void;
  placeholder?: string;
  /** Signal ids to hide (e.g. already assigned to the plot). */
  exclude?: string[];
  triggerClassName?: string;
  size?: "sm" | "default";
}

export default function SignalSelect({
  value,
  onValueChange,
  placeholder = "Select signal…",
  exclude,
  triggerClassName,
  size = "default",
}: SignalSelectProps) {
  const signals = useAvailableSignals();

  const excluded = new Set(exclude ?? []);
  const byBoard = new Map<string, AvailableSignal[]>();
  const composed: AvailableSignal[] = [];
  for (const s of signals) {
    if (excluded.has(s.id)) continue;
    if (s.board) {
      const arr = byBoard.get(s.board) ?? [];
      arr.push(s);
      byBoard.set(s.board, arr);
    } else {
      composed.push(s);
    }
  }
  const boards = [...byBoard.entries()].sort(([a], [b]) => a.localeCompare(b));
  const empty = boards.length === 0 && composed.length === 0;

  return (
    <Select value={value} onValueChange={(v) => { if (v) onValueChange(v); }}>
      <SelectTrigger size={size} className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {empty && (
          <div className="text-muted-foreground px-2 py-3 text-center text-[11px]">
            No series available — open a session first
          </div>
        )}
        {boards.map(([board, items]) => (
          <SelectGroup key={board}>
            <SelectLabel>{board}</SelectLabel>
            {items.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
        {composed.length > 0 && (
          <SelectGroup>
            <SelectLabel>Composed</SelectLabel>
            {composed.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <span className="text-muted-foreground mr-1">
                  {s.kind === "operation" ? "∑" : "𝑓"}
                </span>
                {s.label}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}

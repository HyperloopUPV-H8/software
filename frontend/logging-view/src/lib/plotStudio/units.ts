import type { AdjArchive, AdjMeasurement } from "../../types/session";

/** Board name for a "BOARD/measId" session signal. Composed signals
 * (op_N/tr_N ids, no "/") and plain CSV signals resolve to null. */
export function boardOf(signalId: string): string | null {
  const slash = signalId.indexOf("/");
  return slash === -1 ? null : signalId.slice(0, slash);
}

// Looks up the AdjMeasurement for a "BOARD/measId" signal from the ADJ archive.
// Composed signals (op_N/tr_N ids have no "/") and unknown ids resolve to undefined.
function findMeasurement(adjData: AdjArchive | null, signalId: string): AdjMeasurement | undefined {
  if (!adjData) return undefined;
  const board = boardOf(signalId);
  if (board === null) return undefined;
  const measId = signalId.slice(board.length + 1);

  const group = adjData.boards[board] as Record<string, unknown> | undefined;
  const measurements = group?.[`${board}_measurements`];
  if (!Array.isArray(measurements)) return undefined;

  return (measurements as AdjMeasurement[]).find((m) => m.id === measId);
}

/** Display units for a session signal, e.g. "mm". */
export function getSignalUnits(adjData: AdjArchive | null, signalId: string): string | undefined {
  return findMeasurement(adjData, signalId)?.displayUnits;
}

/** Human-readable ADJ name for a session signal, e.g. "Airgap 1". */
export function getSignalName(adjData: AdjArchive | null, signalId: string): string | undefined {
  return findMeasurement(adjData, signalId)?.name;
}

/** State labels for an enum-typed session signal, indexed by numeric code. */
export function getEnumLabels(adjData: AdjArchive | null, signalId: string): string[] | undefined {
  return findMeasurement(adjData, signalId)?.enumValues;
}

/** Raw ADJ type string ("float32", "enum", "bool", …), lowercased.
 * `undefined` means no ADJ metadata was found at all (e.g. a plain CSV file)
 * — distinct from a known-but-non-discrete type like "float32". Callers that
 * fall back to data-driven heuristics when type info is missing must check
 * for `undefined` specifically, not just "not enum/bool", or every known
 * float/int signal would also hit the fallback. */
export function getSignalType(adjData: AdjArchive | null, signalId: string): string | undefined {
  return findMeasurement(adjData, signalId)?.type?.toLowerCase();
}

/** True for ADJ-typed enum/boolean signals. Some ADJ archives type genuine
 * enums as "string" (see frontend-kit's typeUtils.ts, which buckets "string"
 * with "enum" for badge coloring) rather than literally "enum" — a type
 * match alone would miss those, so this also treats "carries enumValues" as
 * sufficient on its own, regardless of the exact type spelling. */
export function isDiscreteMeasurement(adjData: AdjArchive | null, signalId: string): boolean {
  const m = findMeasurement(adjData, signalId);
  if (!m) return false;
  const type = m.type?.toLowerCase();
  if (type === "enum" || type === "bool" || type === "boolean") return true;
  return !!m.enumValues && m.enumValues.length > 0;
}

// True when two or more signals on the same axis have known but different
// units (e.g. mixing "mm" and "V") — distinct from simply not knowing a unit.
export function unitsMismatch(units: (string | undefined)[]): boolean {
  const known = new Set(units.filter((u): u is string => !!u));
  return known.size > 1;
}

// Reduces per-signal units to a single axis-level unit: only shown when every
// signal on that axis agrees, otherwise omitted silently (no "mixed" label).
export function commonUnits(units: (string | undefined)[]): string | undefined {
  if (units.length === 0) return undefined;
  const first = units[0];
  if (!first) return undefined;
  return units.every((u) => u === first) ? first : undefined;
}

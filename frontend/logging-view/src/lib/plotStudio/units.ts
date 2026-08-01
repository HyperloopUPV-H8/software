import type { AdjArchive, AdjMeasurement } from "../../types/session";

// Looks up the AdjMeasurement for a "BOARD/measId" signal from the ADJ archive.
// Composed signals (op_N/tr_N ids have no "/") and unknown ids resolve to undefined.
function findMeasurement(adjData: AdjArchive | null, signalId: string): AdjMeasurement | undefined {
  if (!adjData) return undefined;
  const slash = signalId.indexOf("/");
  if (slash === -1) return undefined;
  const board = signalId.slice(0, slash);
  const measId = signalId.slice(slash + 1);

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

// Reduces per-signal units to a single axis-level unit: only shown when every
// signal on that axis agrees, otherwise omitted silently (no "mixed" label).
export function commonUnits(units: (string | undefined)[]): string | undefined {
  if (units.length === 0) return undefined;
  const first = units[0];
  if (!first) return undefined;
  return units.every((u) => u === first) ? first : undefined;
}

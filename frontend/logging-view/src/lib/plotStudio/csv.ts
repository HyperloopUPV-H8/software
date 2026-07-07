import type { SignalPoint } from "../../types/plotStudio";

// Multipliers to convert raw timestamp units → milliseconds.
const TIME_UNIT_TO_MS: Record<string, number> = {
  ns: 1e-6,
  us: 1e-3,
  ms: 1,
  s: 1e3,
};

/**
 * Parse a 4-column CSV produced by the backend logger.
 * Expected column order: timestamp, board, backend, value.
 * Time is normalized to start at 0 and converted to ms using `timeUnit`.
 */
export function parseCSV(text: string, timeUnit = "ms"): SignalPoint[] {
  const toMs = TIME_UNIT_TO_MS[timeUnit] ?? 1;
  const lines = text.trim().split("\n");
  const data: SignalPoint[] = [];

  for (const line of lines) {
    const parts = line.split(",");
    if (parts.length >= 4) {
      const timestamp = parseFloat(parts[0]);
      const value = parseFloat(parts[3]);
      if (!isNaN(timestamp) && !isNaN(value)) {
        data.push({ time: timestamp * toMs, value });
      }
    }
  }

  if (data.length > 0) {
    const startTime = data[0].time;
    for (const point of data) point.time -= startTime;
  }

  return data;
}

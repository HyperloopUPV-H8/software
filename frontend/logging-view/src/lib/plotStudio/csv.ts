import type { SeriesData } from "../../types/plotStudio";

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
export function parseCSV(text: string, timeUnit = "ms"): SeriesData {
  const toMs = TIME_UNIT_TO_MS[timeUnit] ?? 1;
  const lines = text.trim().split("\n");
  const time = new Float64Array(lines.length);
  const value = new Float64Array(lines.length);
  let count = 0;

  for (const line of lines) {
    const parts = line.split(",");
    if (parts.length >= 4) {
      const timestamp = parseFloat(parts[0]);
      const v = parseFloat(parts[3]);
      if (!isNaN(timestamp) && !isNaN(v)) {
        time[count] = timestamp * toMs;
        value[count] = v;
        count++;
      }
    }
  }

  const t = time.subarray(0, count);
  const val = value.subarray(0, count);
  if (count > 0) {
    const startTime = t[0];
    for (let i = 0; i < count; i++) t[i] -= startTime;
  }

  return { time: t, value: val };
}

/**
 * Parses a CSV file entirely off the main thread — session CSVs can reach
 * hundreds of thousands of rows, and reading + parsing that synchronously
 * (as parseCSV does) would freeze the tab for the whole duration.
 */
export function parseCSVInWorker(file: File, timeUnit = "ms"): Promise<SeriesData> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./csv.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<{ timeBuffer: ArrayBuffer; valueBuffer: ArrayBuffer; count: number }>) => {
      const { timeBuffer, valueBuffer, count } = e.data;
      worker.terminate();
      resolve({ time: new Float64Array(timeBuffer, 0, count), value: new Float64Array(valueBuffer, 0, count) });
    };
    worker.onerror = (err) => { worker.terminate(); reject(err); };
    worker.postMessage({ file, timeUnit });
  });
}

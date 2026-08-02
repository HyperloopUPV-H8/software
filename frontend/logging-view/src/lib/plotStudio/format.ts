// Shared formatting helpers for export/report surfaces (Stats panel, PDF export).

// Compact numeric formatting: plain notation in a sane range, scientific
// outside it. Number(toPrecision) round-trips to strip trailing zeros safely.
export function fmt(v: number, integer?: boolean): string {
  if (!Number.isFinite(v)) return "—";
  if (integer) return v.toLocaleString();
  const abs = Math.abs(v);
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-4)) return v.toExponential(3);
  return String(Number(v.toPrecision(5)));
}

// "YYYY-MM-DD_HH-MM" in local time, for export filenames.
export function exportTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

// "YYYY-MM-DD" in local time, for report footers (stable for the whole
// generation run — callers should compute this once, not per page).
export function formatExportDate(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

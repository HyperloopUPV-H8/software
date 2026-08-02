// Shared shapes for PDF report generation (src/lib/pdfExport/*).

/** A rasterized chart, ready to embed as one page of the report. */
export interface ChartExport {
  plotId: string;
  title: string;
  imageDataUrl: string;
  pixelWidth: number;
  pixelHeight: number;
}

/** One row of the (optional) Statistics page, grouped by plot. */
export interface StatsRow {
  plotName: string;
  signalName: string;
  mean: number;
  std: number;
  rms: number;
  peakToPeak: number;
  min: number;
  max: number;
  noiseFloor: number;
  samples: number;
}

/** One row of the (optional) Series Annex page — deduped by signalId. */
export interface AnnexRow {
  signalId: string;
  name: string;
  board: string | null;
  unit: string | undefined;
  type: string | undefined;
  color: string;
}

/** Sections the user opted into via the export dialog. Chart pages, the
 * header/footer, and the final check page are always included. */
export interface PdfExportOptions {
  includeToc: boolean;
  includeStats: boolean;
  includeAnnex: boolean;
}

export interface PdfExportResult {
  generated: number;
  skipped: number;
}

/** Session-level metadata (from logger_settings.json) shown at the bottom of
 * the Table of Contents page. */
export interface SessionInfo {
  folderName: string | null;
  date: string | null;
  timeUnit: string | null;
  adjCommitHash: string | null;
}

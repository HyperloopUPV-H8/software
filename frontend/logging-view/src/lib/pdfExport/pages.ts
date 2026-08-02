// Page-drawing primitives. Each function draws into the current page of
// `doc` — page navigation (addPage/setPage) is buildPdf.ts's job, except for
// autoTable's own internal pagination when a table overflows a page.
import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fmt } from "../plotStudio/format";
import {
  ASSET_ASPECT,
  BADGE_BOTTOM_OFFSET,
  CHECK_LOGO_SIZE,
  CHECK_PAGE_FULL_LOGO_TOP,
  CHECK_PAGE_FULL_LOGO_WIDTH,
  CHECK_PAGE_STACK_GAP,
  CHECK_PAGE_SW_LOGO_WIDTH,
  CONTENT_BOTTOM,
  CONTENT_TOP,
  CORNER_LOGO_SIZE,
  HEADER_LOGO_HEIGHT,
  MARGIN,
  PAGE,
  PDF_ASSETS,
} from "./assets";
import type { AnnexRow, ChartExport, SessionInfo, StatsRow } from "./types";

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return [128, 128, 128];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

// Same GitHub org/repo the ADJ archive JSON snapshots are published under
// (see sessionSlice.ts's ADJ_ARCHIVE_URL, which points at its GitHub Pages
// host) — used to link the session's recorded ADJ commit hash.
function adjCommitUrl(hash: string): string {
  return `https://hyperloop-upv.github.io/ADJ-Archive/storage/commit-${hash}.json`;
}

function formatSessionDate(raw: string | null): string {
  if (!raw) return "-";
  const fixed = raw.replace(/T(\d{2})-(\d{2})-(\d{2})$/, "T$1:$2:$3");
  const date = new Date(fixed);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Header: full Hyperloop logo (left) + page number (right). Footer: date
 * (center) + "sw" mark and "Logging View" label (bottom-left). The header
 * logo and sw badge are both skipped on the dedicated check page at the
 * end, which draws its own larger versions of the same brand marks. */
export function drawHeaderFooter(
  doc: jsPDF,
  opts: { dateStr: string; showHeaderLogo: boolean; showSwBadge: boolean; pageNumber: number; totalPages: number },
) {
  const logoH = HEADER_LOGO_HEIGHT;
  const logoY = (MARGIN.top - logoH) / 2;
  if (opts.showHeaderLogo) {
    const logoW = logoH * ASSET_ASPECT.fullLogo;
    doc.addImage(PDF_ASSETS.fullLogo, "PNG", MARGIN.left, logoY, logoW, logoH);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`Page ${opts.pageNumber} / ${opts.totalPages}`, PAGE.width - MARGIN.right, logoY + logoH / 2 + 1.5, { align: "right" });
  doc.setTextColor(0);

  doc.setFontSize(8);
  doc.setTextColor(130);
  doc.text(opts.dateStr, PAGE.width / 2, PAGE.height - 8, { align: "center" });
  doc.setTextColor(0);

  if (opts.showSwBadge) {
    // Badge anchored to the left margin: logo first, then its label to the right.
    const label = "Logging View - Software";
    const gap = 2;
    const swH = CORNER_LOGO_SIZE;
    const swW = swH * ASSET_ASPECT.swLogo;
    const swY = PAGE.height - BADGE_BOTTOM_OFFSET - swH;
    const swX = MARGIN.left;

    doc.addImage(PDF_ASSETS.swLogo, "PNG", swX, swY, swW, swH);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(label, swX + swW + gap, swY + swH / 2 + 1, { align: "left" });
    doc.setFont("helvetica", "normal");
  }
}

/** Fills the reserved TOC page (page 1) once every chart's real page number
 * is known — called last, after all other pages exist. Below the entry list,
 * in whatever room remains, a "Session Configuration" block summarizes the
 * logger_settings.json the session was opened with. */
export function fillTocPage(doc: jsPDF, entries: { title: string; page: number }[], sessionInfo?: SessionInfo) {
  doc.setPage(1);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Table of Contents", MARGIN.left, CONTENT_TOP + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let y = CONTENT_TOP + 20;
  const lineHeight = 8;
  entries.forEach((entry, i) => {
    if (y > CONTENT_BOTTOM) return; // more entries than a single TOC page can hold — rare, clipped
    doc.text(`${i + 1}. ${entry.title}`, MARGIN.left, y);
    doc.text(String(entry.page), PAGE.width - MARGIN.right, y, { align: "right" });
    y += lineHeight;
  });

  if (!sessionInfo) return;
  y += 10;
  if (y > CONTENT_BOTTOM - 10) return; // no room left — rare, skipped rather than overflowing the page

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Session Configuration", MARGIN.left, y);
  y += 9;

  const labelX = MARGIN.left;
  const valueX = MARGIN.left + 38;
  const rows: [string, string][] = [
    ["Session", sessionInfo.folderName ?? "-"],
    ["Date", formatSessionDate(sessionInfo.date)],
    ["Time unit", sessionInfo.timeUnit ?? "-"],
  ];
  doc.setFontSize(10);
  for (const [label, value] of rows) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110);
    doc.text(label, labelX, y);
    doc.setTextColor(0);
    doc.text(value, valueX, y);
    y += 7;
  }

  if (sessionInfo.adjCommitHash) {
    const shortHash = sessionInfo.adjCommitHash.slice(0, 7);
    doc.setTextColor(110);
    doc.text("ADJ commit", labelX, y);
    doc.setTextColor(37, 99, 235); // link color
    doc.textWithLink(shortHash, valueX, y, { url: adjCommitUrl(sessionInfo.adjCommitHash) });
    doc.setTextColor(0);
  }
}

/** Full-data-range per-signal stats, one flat table grouped (in row order)
 * by plot — may spill onto further pages via autoTable's own pagination.
 * `title` lets callers reuse this for either the single combined page
 * ("Statistics (full data range)") or a per-plot page in "per sheet" mode,
 * where the redundant "Plot" column (same value on every row) is dropped. */
export function addStatsPage(
  doc: jsPDF,
  rows: StatsRow[],
  opts: { title?: string; showPlotColumn?: boolean } = {},
) {
  const { title = "Statistics (full data range)", showPlotColumn = true } = opts;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, MARGIN.left, CONTENT_TOP + 4);
  doc.setFont("helvetica", "normal");

  const headRow = ["Signal", "Mean", "Std Dev", "RMS", "Peak-to-Peak", "Min", "Max", "Noise Floor", "Samples"];
  autoTable(doc, {
    startY: CONTENT_TOP + 10,
    margin: { top: CONTENT_TOP, bottom: MARGIN.bottom, left: MARGIN.left, right: MARGIN.right },
    // jsPDF's built-in fonts only support WinAnsi (CP1252) — Greek letters
    // like σ have no glyph and render as garbled spaced-out mojibake, so
    // headers stay plain ASCII here even though the on-screen StatsPanel
    // (real web fonts, no such limit) can use "σ" directly.
    head: [showPlotColumn ? ["Plot", ...headRow] : headRow],
    body: rows.map((r) => [
      ...(showPlotColumn ? [r.plotName] : []),
      r.signalName,
      fmt(r.mean), fmt(r.std), fmt(r.rms), fmt(r.peakToPeak), fmt(r.min), fmt(r.max), fmt(r.noiseFloor),
      fmt(r.samples, true),
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [45, 45, 45] },
  });
}

/** Deduped series metadata across every exported plot, with a color swatch
 * per row — may spill onto further pages via autoTable's own pagination. */
export function addAnnexPage(doc: jsPDF, rows: AnnexRow[]) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Series Annex", MARGIN.left, CONTENT_TOP + 4);
  doc.setFont("helvetica", "normal");

  const colorColIndex = 4;
  autoTable(doc, {
    startY: CONTENT_TOP + 10,
    margin: { top: CONTENT_TOP, bottom: MARGIN.bottom, left: MARGIN.left, right: MARGIN.right },
    head: [["Signal", "Board", "Unit", "Type", "Color"]],
    body: rows.map((r) => [r.name, r.board ?? "-", r.unit ?? "-", r.type ?? "-", ""]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [45, 45, 45] },
    didDrawCell: (data) => {
      if (data.section !== "body" || data.column.index !== colorColIndex) return;
      const row = rows[data.row.index];
      if (!row) return;
      const [r, g, b] = hexToRgb(row.color);
      doc.setFillColor(r, g, b);
      const size = Math.min(data.cell.height, data.cell.width) - 3;
      doc.rect(data.cell.x + 1.5, data.cell.y + (data.cell.height - size) / 2, size, size, "F");
    },
  });
}

/** One chart per page: title, then the rasterized figure centered and
 * scaled to fit the content band while preserving its aspect ratio. */
export function addChartPage(doc: jsPDF, chart: ChartExport) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(chart.title, MARGIN.left, CONTENT_TOP + 4);
  doc.setFont("helvetica", "normal");

  const imageTop = CONTENT_TOP + 10;
  const availW = PAGE.width - MARGIN.left - MARGIN.right;
  const availH = CONTENT_BOTTOM - imageTop;
  const imgAspect = chart.pixelWidth / chart.pixelHeight;

  let w = availW;
  let h = w / imgAspect;
  if (h > availH) {
    h = availH;
    w = h * imgAspect;
  }
  const x = MARGIN.left + (availW - w) / 2;
  const y = imageTop + (availH - h) / 2;
  doc.addImage(chart.imageDataUrl, "PNG", x, y, w, h);
}

/** Final page of the report: a centered top-down brand stack — the full
 * "Hyperloop UPV" team logo, then the "Logging View - Software" sub-brand
 * mark, then the team's "check" mark — each gap-separated from the next. */
export function addCheckPage(doc: jsPDF) {
  const fullW = CHECK_PAGE_FULL_LOGO_WIDTH;
  const fullH = fullW / ASSET_ASPECT.fullLogo;
  const fullX = (PAGE.width - fullW) / 2;
  const fullY = CHECK_PAGE_FULL_LOGO_TOP;
  doc.addImage(PDF_ASSETS.fullLogo, "PNG", fullX, fullY, fullW, fullH);

  const swW = CHECK_PAGE_SW_LOGO_WIDTH;
  const swH = swW / ASSET_ASPECT.swLogo;
  const swX = (PAGE.width - swW) / 2;
  const swY = fullY + fullH + CHECK_PAGE_STACK_GAP;
  doc.addImage(PDF_ASSETS.swLogo, "PNG", swX, swY, swW, swH);

  const w = CHECK_LOGO_SIZE;
  const h = w / ASSET_ASPECT.checkLogo;
  const x = (PAGE.width - w) / 2;
  const y = swY + swH + CHECK_PAGE_STACK_GAP;
  doc.addImage(PDF_ASSETS.checkLogo, "PNG", x, y, w, h);
}

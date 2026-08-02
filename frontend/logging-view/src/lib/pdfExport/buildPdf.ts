// Orchestrates the full report: builds pages in content order (TOC
// placeholder, then either a combined stats page or, in "per sheet" mode, one
// stats page interleaved right after each chart page, series annex, check
// page), then a second pass fills the TOC with real page numbers and stamps
// header/footer/sw-badge on every page — this needs every page to already
// exist so page numbers (TOC) and the check page's index (sw-badge) are known.
import { jsPDF } from "jspdf";
import { exportTimestamp, formatExportDate } from "../plotStudio/format";
import { addAnnexPage, addChartPage, addCheckPage, addStatsPage, drawHeaderFooter, fillTocPage } from "./pages";
import type { AnnexRow, ChartExport, PdfExportOptions, SessionInfo, StatsRow } from "./types";

export async function buildAndDownloadPdf(input: {
  charts: ChartExport[];
  options: PdfExportOptions;
  statsRows: StatsRow[];
  annexRows: AnnexRow[];
  sessionInfo: SessionInfo;
  filename?: string;
}): Promise<void> {
  const { charts, options, statsRows, annexRows, sessionInfo, filename } = input;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // jsPDF documents start with one page already created — reuse it for
  // whichever section comes first instead of leaving a stray blank page.
  let firstPageConsumed = false;
  const ensureFreshPage = () => {
    if (!firstPageConsumed) { firstPageConsumed = true; return; }
    doc.addPage();
  };

  let tocPageIndex: number | null = null;
  if (options.includeToc) {
    ensureFreshPage();
    tocPageIndex = doc.getNumberOfPages();
  }

  const statsPerSheet = options.includeStats && options.statsMode === "perSheet";
  if (options.includeStats && !statsPerSheet && statsRows.length > 0) {
    ensureFreshPage();
    addStatsPage(doc, statsRows);
  }

  const tocEntries: { title: string; page: number }[] = [];
  for (const chart of charts) {
    ensureFreshPage();
    addChartPage(doc, chart);
    tocEntries.push({ title: chart.title, page: doc.getNumberOfPages() });

    if (statsPerSheet) {
      // statsRows carries plotName (== chart.title, both sourced from
      // PlotState.name) so each chart's rows can be picked back out here.
      const plotStatsRows = statsRows.filter((r) => r.plotName === chart.title);
      if (plotStatsRows.length > 0) {
        ensureFreshPage();
        addStatsPage(doc, plotStatsRows, { title: `Statistics — ${chart.title}`, showPlotColumn: false });
      }
    }
  }

  if (options.includeAnnex && annexRows.length > 0) {
    ensureFreshPage();
    addAnnexPage(doc, annexRows);
  }

  ensureFreshPage();
  addCheckPage(doc);
  const checkPageIndex = doc.getNumberOfPages();

  if (tocPageIndex !== null) fillTocPage(doc, tocEntries, sessionInfo);

  const dateStr = formatExportDate();
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const isCheckPage = p === checkPageIndex;
    drawHeaderFooter(doc, { dateStr, showHeaderLogo: !isCheckPage, showSwBadge: !isCheckPage, pageNumber: p, totalPages });
  }

  doc.save(filename ?? `Logging_Report_${exportTimestamp()}_Hyperloop-UPV.pdf`);
}

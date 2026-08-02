// Plotly has no built-in dark/light theming — every color is a literal in
// `layout`. This module is the single source of truth for those colors and
// for the structural layout built from them, so the live chart (theme-
// following) and image exports (always forced light, see PlotWrapper) build
// the exact same shape from two different theme instances.
import type Plotly from "plotly.js-dist";

export interface PlotlyThemeColors {
  paperBg: string;
  plotBg: string;
  fontColor: string;
  gridColor: string;
  neutralLineColor: string;
  hoverBg: string;
  hoverBorder: string;
  hoverFontColor: string;
  legendBg: string;
  legendBorder: string;
  legendFontColor: string;
  modebar?: { bgcolor: string; color: string; activecolor: string };
}

const FONT_FAMILY = "Computer Modern, Latin Modern Math, Times New Roman, serif";

// Dual-axis accent colors are identical in both themes — both read fine on
// white and on the app's dark background.
const LEFT_AXIS_ACCENT  = "#1f77b4";
const RIGHT_AXIS_ACCENT = "#ff7f0e";

export function getPlotlyTheme(isDarkMode: boolean): PlotlyThemeColors {
  if (!isDarkMode) {
    return {
      paperBg: "white", plotBg: "white",
      fontColor: "#000000", gridColor: "#e0e0e0", neutralLineColor: "#000000",
      hoverBg: "rgba(255,255,255,0.97)", hoverBorder: "#000000", hoverFontColor: "#000000",
      legendBg: "rgba(255,255,255,0.95)", legendBorder: "#000000", legendFontColor: "#000000",
    };
  }
  return {
    paperBg: "#181818", plotBg: "#181818",
    fontColor: "#f9fafb", gridColor: "#404040", neutralLineColor: "#f9fafb",
    hoverBg: "rgba(24,24,24,0.95)", hoverBorder: "#404040", hoverFontColor: "#f9fafb",
    legendBg: "rgba(24,24,24,0.9)", legendBorder: "#404040", legendFontColor: "#f9fafb",
    modebar: { bgcolor: "rgba(24,24,24,0)", color: "#b5b5b5", activecolor: "#ff7f24" },
  };
}

export interface BuildPlotLayoutParams {
  theme: PlotlyThemeColors;
  hasFFT: boolean;
  hasRightAxis: boolean;
  plotId: string;
  leftUnits: string | undefined;
  rightUnits: string | undefined;
  // Uniformly scales font sizes and line/tick widths. The live chart always
  // uses 1 (matches on-screen density); PNG export passes a larger value so
  // text reads clearly at the export's fixed pixel size (see PlotWrapper's
  // buildExportFigure).
  fontScale?: number;
}

export function buildPlotLayout({
  theme, hasFFT, hasRightAxis, plotId, leftUnits, rightUnits, fontScale = 1,
}: BuildPlotLayoutParams): Partial<Plotly.Layout> {
  // The live chart's plot area is only a few hundred px tall (resizable, user
  // controlled), while export renders into a fixed 1600px-tall canvas — the
  // same legend "y" fraction lands at very different pixel offsets from the
  // x-axis on each, so the two need separately tuned gaps rather than one
  // value scaled by fontScale.
  const isExport = fontScale !== 1;
  const marginBottom = isExport ? 110 * fontScale : 130;
  const marginTop    = isExport ? 70 * fontScale  : 40 * fontScale;
  const marginSide   = isExport ? 1.5 : 1; // extra breathing room around the export canvas only
  const legendY = isExport ? -0.1 : -0.35;
  const base: Partial<Plotly.Layout> = {
    autosize: true,
    // Preserve zoom/pan across data changes (adding signals, stats, etc.);
    // reset only when the X-axis meaning flips between time and frequency.
    uirevision: hasFFT ? `${plotId}:fft` : plotId,
    paper_bgcolor: theme.paperBg, plot_bgcolor: theme.plotBg,
    font: { color: theme.fontColor, family: FONT_FAMILY, size: 14 * fontScale },
    // Plot title stays editable (click-to-enter placeholder); Plotly's
    // subtitle prompt is hidden via CSS (.gtitle-subtitle in index.css)
    // since there's no config flag to disable just that piece.
    title: { font: { size: 22 * fontScale } },
    xaxis: {
      title: { text: hasFFT ? "Frequency (Hz)" : "Time (ms)", font: { size: 16 * fontScale, color: theme.fontColor } },
      tickfont: { size: 14 * fontScale, color: theme.neutralLineColor },
      gridcolor: theme.gridColor, linecolor: theme.neutralLineColor, linewidth: 1.5 * fontScale, mirror: true,
      ticks: "outside", tickwidth: 1.5 * fontScale, tickcolor: theme.neutralLineColor, color: theme.neutralLineColor,
      showline: true, zeroline: false, fixedrange: false,
      exponentformat: "power", separatethousands: true,
    },
    yaxis: {
      title: {
        text: hasRightAxis
          ? `Value (Left${leftUnits ? `, ${leftUnits}` : ""})`
          : `Value${leftUnits ? ` (${leftUnits})` : ""}`,
        font: { size: 16 * fontScale, color: hasRightAxis ? LEFT_AXIS_ACCENT : theme.fontColor },
      },
      tickfont: { size: 14 * fontScale, color: hasRightAxis ? LEFT_AXIS_ACCENT : theme.neutralLineColor },
      gridcolor: theme.gridColor, linecolor: hasRightAxis ? LEFT_AXIS_ACCENT : theme.neutralLineColor, linewidth: 1.5 * fontScale, mirror: !hasRightAxis,
      ticks: "outside", tickwidth: 1.5 * fontScale, tickcolor: hasRightAxis ? LEFT_AXIS_ACCENT : theme.neutralLineColor, color: hasRightAxis ? LEFT_AXIS_ACCENT : theme.neutralLineColor,
      showline: true, zeroline: false, fixedrange: false,
      exponentformat: "power", separatethousands: true,
    },
    margin: {
      l: 80 * fontScale * marginSide, r: (hasRightAxis ? 80 : 40) * fontScale * marginSide,
      t: marginTop, b: marginBottom,
    },
    // Unified hover: one label per signal at the same X — much easier to
    // compare synchronized measurements than per-point "closest" mode.
    hovermode: "x unified",
    hoverlabel: {
      bgcolor: theme.hoverBg,
      bordercolor: theme.hoverBorder,
      font: { family: FONT_FAMILY, size: 12 * fontScale, color: theme.hoverFontColor },
    },
    showlegend: true,
    legend: {
      bgcolor: theme.legendBg, bordercolor: theme.legendBorder, borderwidth: 1, font: { size: 13 * fontScale, color: theme.legendFontColor },
      orientation: "h", x: 1, xanchor: "right", y: legendY, yanchor: "top",
    },
  };
  if (theme.modebar) {
    base.modebar = theme.modebar;
  }
  if (hasRightAxis) {
    base.yaxis2 = {
      title: { text: `Value (Right${rightUnits ? `, ${rightUnits}` : ""})`, font: { size: 16 * fontScale, color: RIGHT_AXIS_ACCENT } },
      tickfont: { size: 14 * fontScale, color: RIGHT_AXIS_ACCENT },
      overlaying: "y", side: "right", gridcolor: "transparent",
      linecolor: RIGHT_AXIS_ACCENT, linewidth: 1.5 * fontScale, ticks: "outside", tickwidth: 1.5 * fontScale,
      tickcolor: RIGHT_AXIS_ACCENT, color: RIGHT_AXIS_ACCENT, showline: true, zeroline: false, fixedrange: false,
      exponentformat: "power", separatethousands: true,
    };
  }
  return base;
}

export interface BuildTimelineLayoutParams {
  theme: PlotlyThemeColors;
  plotId: string;
  rowLabels: string[]; // one per signal, top-to-bottom in assignment order
  fontScale?: number;
}

// Sibling to buildPlotLayout for the "Cronograma" (Gantt) plot mode: one
// categorical row per signal instead of a shared numeric Y axis. Reuses the
// same theme/font/margin conventions so the two modes look like the same
// app, but the shapes diverge enough (no yaxis2, no FFT/time toggle on the
// X title) that folding this into buildPlotLayout would mean more branches
// than shared code.
export function buildTimelineLayout({
  theme, plotId, rowLabels, fontScale = 1,
}: BuildTimelineLayoutParams): Partial<Plotly.Layout> {
  const isExport = fontScale !== 1;
  const marginSide = isExport ? 1.5 : 1;
  const base: Partial<Plotly.Layout> = {
    autosize: true,
    uirevision: `${plotId}:timeline`,
    paper_bgcolor: theme.paperBg, plot_bgcolor: theme.plotBg,
    font: { color: theme.fontColor, family: FONT_FAMILY, size: 14 * fontScale },
    title: { font: { size: 22 * fontScale } },
    barmode: "stack",
    xaxis: {
      title: { text: "Time (ms)", font: { size: 16 * fontScale, color: theme.fontColor } },
      tickfont: { size: 14 * fontScale, color: theme.neutralLineColor },
      gridcolor: theme.gridColor, linecolor: theme.neutralLineColor, linewidth: 1.5 * fontScale, mirror: true,
      ticks: "outside", tickwidth: 1.5 * fontScale, tickcolor: theme.neutralLineColor, color: theme.neutralLineColor,
      showline: true, zeroline: false, fixedrange: false,
    },
    yaxis: {
      type: "category",
      categoryarray: rowLabels,
      autorange: "reversed", // first-assigned signal on top, Gantt convention
      tickfont: { size: 14 * fontScale, color: theme.neutralLineColor },
      gridcolor: theme.gridColor, linecolor: theme.neutralLineColor, linewidth: 1.5 * fontScale,
      showline: true, zeroline: false, fixedrange: true,
    },
    margin: {
      l: 120 * fontScale * marginSide, r: 40 * fontScale * marginSide,
      t: (isExport ? 70 : 40) * fontScale, b: (isExport ? 110 : 60) * fontScale,
    },
    hovermode: "closest",
    hoverlabel: {
      bgcolor: theme.hoverBg,
      bordercolor: theme.hoverBorder,
      font: { family: FONT_FAMILY, size: 12 * fontScale, color: theme.hoverFontColor },
    },
    showlegend: true,
    legend: {
      bgcolor: theme.legendBg, bordercolor: theme.legendBorder, borderwidth: 1, font: { size: 13 * fontScale, color: theme.legendFontColor },
      orientation: "h", x: 1, xanchor: "right", y: isExport ? -0.1 : -0.25, yanchor: "top",
    },
  };
  if (theme.modebar) {
    base.modebar = theme.modebar;
  }
  return base;
}

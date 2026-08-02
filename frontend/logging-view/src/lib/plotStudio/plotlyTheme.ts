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
}

export function buildPlotLayout({
  theme, hasFFT, hasRightAxis, plotId, leftUnits, rightUnits,
}: BuildPlotLayoutParams): Partial<Plotly.Layout> {
  const base: Partial<Plotly.Layout> = {
    autosize: true,
    // Preserve zoom/pan across data changes (adding signals, stats, etc.);
    // reset only when the X-axis meaning flips between time and frequency.
    uirevision: hasFFT ? `${plotId}:fft` : plotId,
    paper_bgcolor: theme.paperBg, plot_bgcolor: theme.plotBg,
    font: { color: theme.fontColor, family: FONT_FAMILY, size: 14 },
    // Plot title stays editable (click-to-enter placeholder); Plotly's
    // subtitle prompt is hidden via CSS (.gtitle-subtitle in index.css)
    // since there's no config flag to disable just that piece.
    title: {},
    xaxis: {
      title: { text: hasFFT ? "Frequency (Hz)" : "Time (ms)", font: { size: 16, color: theme.fontColor } },
      gridcolor: theme.gridColor, linecolor: theme.neutralLineColor, linewidth: 1.5, mirror: true,
      ticks: "outside", tickwidth: 1.5, tickcolor: theme.neutralLineColor, color: theme.neutralLineColor,
      showline: true, zeroline: false, fixedrange: false,
      exponentformat: "power", separatethousands: true,
    },
    yaxis: {
      title: {
        text: hasRightAxis
          ? `Value (Left${leftUnits ? `, ${leftUnits}` : ""})`
          : `Value${leftUnits ? ` (${leftUnits})` : ""}`,
        font: { size: 16, color: hasRightAxis ? LEFT_AXIS_ACCENT : theme.fontColor },
      },
      gridcolor: theme.gridColor, linecolor: hasRightAxis ? LEFT_AXIS_ACCENT : theme.neutralLineColor, linewidth: 1.5, mirror: !hasRightAxis,
      ticks: "outside", tickwidth: 1.5, tickcolor: hasRightAxis ? LEFT_AXIS_ACCENT : theme.neutralLineColor, color: hasRightAxis ? LEFT_AXIS_ACCENT : theme.neutralLineColor,
      showline: true, zeroline: false, fixedrange: false,
      exponentformat: "power", separatethousands: true,
    },
    margin: { l: 80, r: hasRightAxis ? 80 : 40, t: 40, b: 130 },
    // Unified hover: one label per signal at the same X — much easier to
    // compare synchronized measurements than per-point "closest" mode.
    hovermode: "x unified",
    hoverlabel: {
      bgcolor: theme.hoverBg,
      bordercolor: theme.hoverBorder,
      font: { family: FONT_FAMILY, size: 12, color: theme.hoverFontColor },
    },
    showlegend: true,
    legend: {
      bgcolor: theme.legendBg, bordercolor: theme.legendBorder, borderwidth: 1, font: { size: 13, color: theme.legendFontColor },
      orientation: "h", x: 1, xanchor: "right", y: -0.35, yanchor: "top",
    },
  };
  if (theme.modebar) {
    base.modebar = theme.modebar;
  }
  if (hasRightAxis) {
    base.yaxis2 = {
      title: { text: `Value (Right${rightUnits ? `, ${rightUnits}` : ""})`, font: { size: 16, color: RIGHT_AXIS_ACCENT } },
      overlaying: "y", side: "right", gridcolor: "transparent",
      linecolor: RIGHT_AXIS_ACCENT, linewidth: 1.5, ticks: "outside", tickwidth: 1.5,
      tickcolor: RIGHT_AXIS_ACCENT, color: RIGHT_AXIS_ACCENT, showline: true, zeroline: false, fixedrange: false,
      exponentformat: "power", separatethousands: true,
    };
  }
  return base;
}

import Plotly from "plotly.js-dist";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useStore } from "../../../store/store";

export interface PlotlyChartHandle {
  getDiv: () => HTMLDivElement | null;
  resize: () => void;
}

// Plotly divs expose a Node-style event emitter after newPlot()
type PlotlyEventDiv = HTMLDivElement & { on?: (event: string, cb: () => void) => void };

interface PlotlyChartProps {
  traces: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  config?: Partial<Plotly.Config>;
  style?: React.CSSProperties;
}

const PlotlyChart = forwardRef<PlotlyChartHandle, PlotlyChartProps>(
  ({ traces, layout, config, style }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const mountedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      getDiv: () => divRef.current,
      resize: () => {
        if (divRef.current) Plotly.Plots.resize(divRef.current);
      },
    }));

    useEffect(() => {
      if (!divRef.current) return;
      if (!mountedRef.current) {
        Plotly.newPlot(divRef.current, traces, layout, config ?? {});
        mountedRef.current = true;
      } else {
        Plotly.react(divRef.current, traces, layout, config ?? {});
      }
    }, [traces, layout, config]);

    useEffect(() => {
      const div = divRef.current;
      if (!div) return;
      const observer = new ResizeObserver(() => {
        requestAnimationFrame(() => Plotly.Plots.resize(div));
      });
      observer.observe(div);
      return () => observer.disconnect();
    }, []);

    // Some environments (e.g. Linux with software/no GPU acceleration) can't
    // sustain scattergl at all — the browser drops the context immediately.
    // Flip the shared flag so every chart (including this one, on its next
    // render) falls back to plain SVG scatter instead of staying blank.
    useEffect(() => {
      const div = divRef.current as PlotlyEventDiv | null;
      if (!div?.on) return;
      const handler = () => useStore.getState().setWebglUnavailable();
      div.on("plotly_webglcontextlost", handler);
    }, []);

    // Release the plot's WebGL context on unmount. Without this, removing a
    // plot (or clearing its last signal, which unmounts this component) leaks
    // its scattergl context — browsers cap live WebGL contexts (~8-16), so
    // enough create/remove cycles on large datasets silently blanks other
    // plots' canvases once the cap is hit ("WebGL context was lost").
    useEffect(() => {
      const div = divRef.current;
      return () => {
        if (div) Plotly.purge(div);
      };
    }, []);

    return <div ref={divRef} style={{ width: "100%", ...style }} />;
  },
);

PlotlyChart.displayName = "PlotlyChart";
export default PlotlyChart;

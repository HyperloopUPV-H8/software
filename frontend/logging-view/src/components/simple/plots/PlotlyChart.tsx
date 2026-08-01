import Plotly from "plotly.js-dist";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface PlotlyChartHandle {
  getDiv: () => HTMLDivElement | null;
  resize: () => void;
}

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

    // Release Plotly's resources for this div on unmount — without this,
    // removing a plot (or clearing its last signal, which unmounts this
    // component) leaks whatever the figure was holding onto.
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

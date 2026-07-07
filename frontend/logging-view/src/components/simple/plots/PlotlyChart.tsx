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

    return <div ref={divRef} style={{ width: "100%", ...style }} />;
  },
);

PlotlyChart.displayName = "PlotlyChart";
export default PlotlyChart;

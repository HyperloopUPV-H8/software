import styles from "@components/ChartMenu/Chart/LinesCanvas/LinesCanvas.module.scss";
import { useEffect, useRef } from "react";
import { ChartCanvas } from "@components/ChartMenu/Chart/LinesCanvas/ChartCanvas";
import { getVectorLimits } from "@utils/math";
import { LineFigure } from "@components/ChartMenu/ChartElement";
import { maxHeaderSize } from "http";
type Props = {
  lineFigures: LineFigure[];
};

export const LinesCanvas = ({ lineFigures }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvas = useRef<ChartCanvas>();

  function drawChart() {
    chartCanvas.current!.clear();
    lineFigures.forEach((lineFigure) => {
      if (lineFigure.vector.length >= 2) {
        chartCanvas.current!.figure(lineFigure.vector, lineFigure.color);
      }
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    chartCanvas.current = new ChartCanvas(ctx);
  }, []);

  useEffect(() => {
    let max = -Infinity;
    let min = Infinity;

    lineFigures.forEach((lineFigure) => {
      let [localMax, localMin] = getVectorLimits(lineFigure.vector);
      max = localMax > max ? localMax : max;
      min = localMin < min ? localMin : min;
    });
    chartCanvas.current!.max = max;
    chartCanvas.current!.min = min;
    drawChart();
  }, [lineFigures]);

  return (
    <canvas
      id={styles.canvas}
      ref={canvasRef}
      width="800"
      height="400"
    ></canvas>
  );
};

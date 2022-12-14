import styles from "@components/ChartMenu/Chart/LinesCanvas/LinesCanvas.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChartCanvas } from "@components/ChartMenu/Chart/LinesCanvas/ChartCanvas";
import { getVectorLimits } from "@utils/math";
import { LineFigure } from "@components/ChartMenu/ChartElement";
import { memo } from "react";
type Props = {
  lineFigures: Map<string, LineFigure>;
};

const LinesCanvas = ({ lineFigures }: Props) => {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvas = useRef<ChartCanvas>();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    chartCanvas.current = new ChartCanvas(ctx);
  }, []);

  useEffect(() => {
    let max = -Infinity;
    let min = Infinity;
    lineFigures.forEach((lineFigure) => {
      let [lineMax, lineMin] = getVectorLimits(lineFigure.vector);
      max = lineMax > max ? lineMax : max;
      min = lineMin < min ? lineMin : min;
    });
    chartCanvas.current!.max = max;
    chartCanvas.current!.min = min;
    drawChart();
  }, [lineFigures]);

  function drawChart() {
    chartCanvas.current!.clear();
    chartCanvas.current!.figures(Array.from(lineFigures.values()));
  }

  return (
    <canvas
      id={styles.canvas}
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
    ></canvas>
  );
};

export default memo(LinesCanvas);

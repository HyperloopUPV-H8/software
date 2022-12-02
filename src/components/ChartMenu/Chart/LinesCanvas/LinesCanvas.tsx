import styles from "@components/ChartMenu/Chart/LinesCanvas/LinesCanvas.module.scss";
import { useEffect, useRef } from "react";
import { ChartCanvas } from "@components/ChartMenu/Chart/LinesCanvas/ChartCanvas";
import { Point, getValueFromVector, concatenateVectors } from "@utils/math";
import { HSLColor } from "@utils/color";
type Props = {
  figures: LineFigure[];
};

export type LineFigure = {
  vector: Point[];
  color: HSLColor;
};

export const LinesCanvas = ({ figures }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvas = useRef<ChartCanvas>();

  function drawChart() {
    chartCanvas.current!.clear();
    figures.forEach((figure, index) => {
      if (figure.vector.length >= 2) {
        chartCanvas.current!.figure(figure.vector, 3, figure.color);
      }
    });
  }

  function getMaxXOfVector(vector: Point[]): number {
    return getValueFromVector(
      vector,
      "x",
      (value, currentBest) => value > currentBest,
      -Infinity
    );
  }

  function getMaxYOfVector(vector: Point[]): number {
    return getValueFromVector(
      vector,
      "y",
      (value, currentBest) => value > currentBest,
      -Infinity
    );
  }

  function getMinXOfVector(vector: Point[]): number {
    return getValueFromVector(
      vector,
      "x",
      (value, currentBest) => value < currentBest,
      Infinity
    );
  }

  function getMinYOfVector(vector: Point[]): number {
    return getValueFromVector(
      vector,
      "y",
      (value, currentBest) => value < currentBest,
      Infinity
    );
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    chartCanvas.current = new ChartCanvas(ctx);
  }, []);

  useEffect(() => {
    let longVector = concatenateVectors(
      figures.map((figure) => {
        return figure.vector;
      })
    );
    chartCanvas.current!.maxX = getMaxXOfVector(longVector);
    chartCanvas.current!.maxY = getMaxYOfVector(longVector);
    chartCanvas.current!.minX = getMinXOfVector(longVector);
    chartCanvas.current!.minY = getMinYOfVector(longVector);
    drawChart();
  }, [figures]);

  return (
    <canvas
      id={styles.canvas}
      ref={canvasRef}
      width="800"
      height="400"
    ></canvas>
  );
};

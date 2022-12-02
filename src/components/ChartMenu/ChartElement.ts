import { HSLColor } from "@utils/color";
export type ChartElement = {
  id: number;
  lines: LineFigure[];
};

export type LineFigure = { name: string; vector: number[]; color: HSLColor };

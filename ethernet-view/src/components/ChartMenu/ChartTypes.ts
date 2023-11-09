import { Chart } from "canvasjs";
import { LineDescription } from "common";

export type ChartLine = LineDescription & { units: string };

export interface ChartType {
    id: string,
    line: ChartLine,
    canvas: Chart | undefined
}
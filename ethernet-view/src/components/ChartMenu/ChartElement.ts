import { LineDescription } from "common";

export type ChartLine = LineDescription & { name: string; units: string };

export type ChartElement = {
    id: string;
    lines: ChartLine[];
};

import { LineDataHandler } from "./LineDataHandler";

export type LineDescription = { id: string; color: string };

export type LineInstance = {
    id: string;
    lineHandler: LineDataHandler;
    range: [number, number];
    getUpdate: () => number;
    ref: SVGPathElement;
};

import { HSLAColor } from "utils/color";
export type ChartElement = {
    id: number;
    lines: Map<string, LineFigure>; //TODO: consider changin to arr
};

export class LineFigure {
    public name: string;
    public vector: number[];
    public color: HSLAColor;

    constructor(name: string, color: HSLAColor) {
        this.name = name;
        this.vector = new Array(1000).fill(0);
        this.color = color;
    }

    public updateVector(newValue: number) {
        this.vector.push(newValue);
        this.vector.shift();
    }
}

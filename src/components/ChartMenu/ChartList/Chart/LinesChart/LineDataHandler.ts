export class LineDataHandler {
    private data: number[];
    private maxLineLength: number;
    private minY: number;
    private maxY: number;

    constructor(initialData: number[], maxLineLength: number) {
        if (maxLineLength < 2) {
            console.error("maxLineLength should be greater or equal than 2");
        }

        this.maxLineLength = maxLineLength;
        this.data = initialData.slice(0, maxLineLength);
        [this.minY, this.maxY] = getMinMaxY(initialData);
    }

    public updateData(newValue: number): void {
        this.data.push(newValue);
        if (this.data.length > this.maxLineLength) {
            this.data.shift();
        }

        this.updateLimits(newValue);
    }

    private updateLimits(newValue: number): void {
        this.minY = newValue < this.minY ? newValue : this.minY;
        this.maxY = newValue > this.maxY ? newValue : this.maxY;
    }

    public getData(): number[] {
        return [...this.data];
    }

    public getLimits() {
        return {
            minX: 0,
            maxX: this.data.length - 1,
            minY: this.minY,
            maxY: this.maxY,
        };
    }
}

function getMinMaxY(points: number[]) {
    let minY = Infinity;
    let maxY = -Infinity;

    for (let value of points) {
        minY = value < minY ? value : minY;
        maxY = value > maxY ? value : maxY;
    }

    return [minY, maxY];
}

export class LineDataHandler {
    private data: number[];
    private maxDataLength: number;
    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;

    constructor(initialData: number[], maxDataLength: number) {
        //TODO: error if maxDataLength < 2? ó < 1?
        this.maxDataLength = maxDataLength;
        this.data = initialData.slice(0, maxDataLength);
        this.minX = 0;
        this.maxX = this.data.length - 1;
        [this.minY, this.maxY] = getMinMaxY(initialData);
    }

    public updateData(newValue: number): void {
        this.data.push(newValue);
        if (this.data.length > this.maxDataLength) {
            this.data.shift();
        }

        this.updateLimits(newValue);
    }

    private updateLimits(newValue: number): void {
        this.maxX = this.data.length - 1;
        this.minY = newValue < this.minY ? newValue : this.minY;
        this.maxY = newValue > this.maxY ? newValue : this.maxY;
    }

    public getData(): number[] {
        return [...this.data];
    }

    public getLimits() {
        return {
            minX: this.minX,
            maxX: this.maxX,
            minY: this.minY,
            maxY: this.maxY,
        } as const;
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

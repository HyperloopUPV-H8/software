export class RangeArray {
    private arr: number[];
    private length: number;
    private min: number;
    private max: number;

    constructor(initArr: number[], length: number) {
        if (length < 2) {
            console.error("maxLineLength should be greater or equal than 2");
        }

        if (initArr.length > length) {
            console.warn(
                `initArr (length ${initArr.length}) is bigger than length ${length}`
            );
        }

        this.length = length;
        this.arr = initArr.slice(0, length);
        [this.min, this.max] = getRange(initArr);
    }

    public push(value: number): void {
        this.arr.push(value);
        if (this.arr.length > this.length) {
            this.arr.shift();
        }

        this.updateRange(value);
    }

    public getArr(): number[] {
        return this.arr;
    }

    public getRange() {
        return [this.min, this.max] as const;
    }

    private updateRange(value: number): void {
        this.min = value < this.min ? value : this.min;
        this.max = value > this.max ? value : this.max;
    }
}

function getRange(points: number[]) {
    let min = Infinity;
    let max = -Infinity;

    for (let value of points) {
        min = value < min ? value : min;
        max = value > max ? value : max;
    }

    return [min, max];
}

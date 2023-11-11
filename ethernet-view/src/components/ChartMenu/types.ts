export type ChartInfo = {
    readonly id: string;
    readonly name: string;
    readonly range: [number | null, number | null];
    readonly color: string;
    readonly units: string;
    readonly getUpdate: () => number;
};
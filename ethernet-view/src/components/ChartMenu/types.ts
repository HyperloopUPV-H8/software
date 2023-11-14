export type ChartId = string;
export type MeasurementId = string;

export type MeasurementInfo = {
    readonly id: string,
    readonly name: string,
    readonly range: [number | null, number | null],
    readonly color: string,
    readonly units: string,
    readonly getUpdate: () => number,
};

export type ChartInfo = {
    chartId: ChartId,
    measurementId: MeasurementId,
};

export type Measurements = MeasurementInfo[];

export interface Point {
    x: number,
    y: number,
};
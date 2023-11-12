export type MeasurementInfo = {
    readonly id: string;
    readonly name: string;
    readonly range: [number | null, number | null];
    readonly color: string;
    readonly units: string;
    readonly getUpdate: () => number;
};

export type ChartId = string

export type ChartInfo = {
    chartId: ChartId,
    measurements: MeasurementInfo[]
}
export type ChartId = string;
export type MeasurementId = string;
export type MeasurementName = string;
export type MeasurementColor = string;
export type MeasurementUnits = string;

export type MeasurementInfo = {
    readonly id: MeasurementId,
    readonly name: MeasurementName,
    readonly range: [number | null, number | null],
    readonly color: MeasurementColor,
    readonly units: MeasurementUnits,
    readonly getUpdate: () => number,
};

export type ChartInfo = {
    chartId: ChartId,
    measurementId: MeasurementId,
};

export type Measurements = MeasurementInfo[];

export type DataSeries = {
    type: string,
    showInLegend: boolean,
    name: MeasurementName,
    color: MeasurementColor,
    dataPoints: Point[],
    updateFunction: () => void,
};

export interface Point {
    x: number,
    y: number,
};
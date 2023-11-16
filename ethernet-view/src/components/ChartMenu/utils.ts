import { DataSeries, MeasurementInfo, Point } from "./types";

// Helper function to create a dataSeries out of the box to add to the chart options
export function createDataSeries(measurement: MeasurementInfo): DataSeries {
    return {
        type: "line",
        legendText: measurement.units ? `${measurement.name} (${measurement.units})` : measurement.name,
        showInLegend: true,
        name: measurement.name,
        color: measurement.color,
        dataPoints: [] as Point[],
        updateFunction: measurement.getUpdate,
    };
}
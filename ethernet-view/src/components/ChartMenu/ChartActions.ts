import { ChartId, MeasurementInfo } from "./types";

type AddChart = {
    type: "add_chart",
    payload: {
        chartId: ChartId,
        measurementInfo: MeasurementInfo
    }
};

type RemoveChart = {
    type: "remove_chart",
    payload: ChartId,
};

type AddMeasurementToChart = {
    type: "add_measurement_to_chart",
    payload: {
        chartId: ChartId,
        measurementInfo: MeasurementInfo
    }
}

type RemoveMeasurementFromChart = {
    type: "remove_measurement_from_chart",
    payload: {
        chartId: ChartId,
        measurementName: string
    }
}

export type ChartActions = AddChart | RemoveChart | AddMeasurementToChart | RemoveMeasurementFromChart
import { ChartId, MeasurementId } from "./types";

type AddChart = {
    type: "add_chart",
    payload: {
        chartId: ChartId,
        measurementId: MeasurementId,
    },
};

type RemoveChart = {
    type: "remove_chart",
    payload: ChartId,
};

export type ChartActions = AddChart | RemoveChart;
import { useReducer } from "react";
import { ChartId, ChartInfo, MeasurementInfo } from "./types";
import { ChartActions } from "./ChartActions";

function reducer(state: ChartInfo[], action: ChartActions): ChartInfo[] {
    switch (action.type) {
        case "add_chart":
            return [
                ...state,
                {
                    chartId: action.payload.chartId,
                    measurements: [action.payload.measurementInfo],
                },
            ];
        case "remove_chart": {
            return state.filter((e) => (e.chartId !== action.payload));
        }
        case "add_measurement_to_chart": {
            const { chartId, measurementInfo } = action.payload;
            return state.map(chart => {
                if (chart.chartId == chartId) {
                    return {
                        ...chart,
                        measurements: [...chart.measurements, measurementInfo]
                    }
                }
                return chart
            })
        }
        case "remove_measurement_from_chart": {
            const { chartId, measurementName } = action.payload;
            return state.map(chart => {
                if (chart.chartId == chartId) {
                    return {
                        ...chart,
                        measurements: chart.measurements.filter((measurement) => measurement.name !== measurementName),
                    };
                }
                return chart;
            });
        }
        default: {
            return state;
        }
    }
}

// Custom hook to manage the charts showed in the ChartMenu component.
// It stores each chart with an id and a list of different measurements to show in it.
export function useCharts() {
    const [charts, dispatch] = useReducer(reducer, []);

    return {
        charts,
        addChart: (chartId: ChartId, measurementInfo: MeasurementInfo) =>
            dispatch({ type: "add_chart", payload: { chartId, measurementInfo } }),
        removeChart: (chartId: ChartId) =>
            dispatch({ type: "remove_chart", payload: chartId }),
        addMeasurementToChart: (chartId: ChartId, measurementInfo: MeasurementInfo) =>
            dispatch({ type: "add_measurement_to_chart", payload: { chartId, measurementInfo } }),
        removeMeasurementFromChart: (chartId: ChartId, measurementName: string) =>
            dispatch({ type: "remove_measurement_from_chart", payload: { chartId, measurementName } }),
    };
}

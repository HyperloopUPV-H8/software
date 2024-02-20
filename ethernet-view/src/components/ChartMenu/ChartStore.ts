import { create } from 'zustand';
import { NumericMeasurementInfo, MeasurementId } from 'common';

export type ChartId = string;

type ChartInfo = {
    chartId: ChartId, 
    measurements: NumericMeasurementInfo[]
};
type ChartSet = ChartInfo[];
type ChartStore = {
    charts: ChartSet;
    addChart: (chartId: ChartId, initialMeasurement: NumericMeasurementInfo) => void;
    removeChart: (chartId: ChartId) => void;
    addMeasurementToChart: (chartId: ChartId, measurement: NumericMeasurementInfo) => void;
    removeMeasurementFromChart: (chartId: ChartId, measurementId: MeasurementId) => void;
    getMeasurementsFromChart: (chartId: ChartId) => NumericMeasurementInfo[] | undefined;
};

export const useChartStore = create<ChartStore>((set, get) => ({
    charts: [] as ChartSet,

    addChart: (chartId: ChartId, initialMeasurement: NumericMeasurementInfo) => {
        const newChart = {
            chartId: chartId,
            measurements: [initialMeasurement]
        };

        set(state => ({
            ...state,
            charts: [...state.charts, newChart]
        }));
    },
    removeChart: (chartId: ChartId) => {
        const chartsDraft = get().charts;
        const newCharts = chartsDraft.filter(chart => chart.chartId !== chartId);

        set(state => ({
            ...state,
            charts: newCharts
    }));
    },
    addMeasurementToChart: (chartId: ChartId, measurement: NumericMeasurementInfo) => {
        const chartsDraft = get().charts;
        const chartIndex = chartsDraft.findIndex(chart => chart.chartId === chartId);
        if(chartIndex != -1) {
            const chart = chartsDraft[chartIndex];
            if(!isMeasurementInChart(measurement.id, chart)) {
                chart.measurements.push(measurement);

                set(state => ({
                    ...state,
                    charts: [
                        ...state.charts.slice(0, chartIndex),
                        chart,
                        ...state.charts.slice(chartIndex + 1)
                    ]
                }));
            }
        }
    },
    removeMeasurementFromChart: (chartId: ChartId, measurementId: MeasurementId) => {
        const chartsDraft = get().charts;
        const chartIndex = chartsDraft.findIndex(chart => chart.chartId === chartId);
        if(chartIndex != -1) {
            const chart = chartsDraft[chartIndex];
            const newMeasurements = chart.measurements.filter(measurement => measurement.id !== measurementId);
            chart.measurements = newMeasurements;

            set(state => ({
                ...state,
                charts: [
                    ...state.charts.slice(0, chartIndex),
                    chart,
                    ...state.charts.slice(chartIndex + 1)
                ]
            }));
        }
    },
    getMeasurementsFromChart: (chartId: ChartId) => {
        const chart = get().charts.find(chart => chart.chartId === chartId);
        return chart ? chart.measurements : undefined;
    }
}));

function isMeasurementInChart(measurementId: MeasurementId, chart: ChartInfo) {
    return chart.measurements.some(measurement => measurement.id === measurementId);
}
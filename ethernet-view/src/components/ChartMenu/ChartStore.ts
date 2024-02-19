import { create } from 'zustand';
import { NumericMeasurementInfo, MeasurementId } from 'common';

export type ChartId = string;

type ChartSet = Map<ChartId, NumericMeasurementInfo[]>;

type ChartStore = {
    charts: ChartSet;
    addChart: (chartId: ChartId, initialMeasurement: NumericMeasurementInfo) => void;
    removeChart: (chartId: ChartId) => void;
    addMeasurement: (chartId: ChartId, measurement: NumericMeasurementInfo) => void;
    removeMeasurement: (chartId: ChartId, measurementId: MeasurementId) => void;
};

export const useChartStore = create<ChartStore>((set) => ({
    charts: new Map(),
    addChart: (chartId: ChartId, initialMeasurement: NumericMeasurementInfo) => {
        set(() => ({
            charts: new Map().set(chartId, [initialMeasurement])
        }));
    },
    removeChart: (chartId: ChartId) => {
        set((state) => ({
            charts: new Map([...state.charts].filter(([id, _]) => id !== chartId))
        }));
    },
    addMeasurement: (chartId: ChartId, measurement: NumericMeasurementInfo) => {
        set((state) => ({
            charts: new Map([...state.charts].map(([id, measurements]) => {
                if (id === chartId) {
                    measurements.push(measurement);
                }
                return [id, measurements];
            }))
        }));
    },
    removeMeasurement: (chartId: ChartId, measurementId: MeasurementId) => {
        set((state) => ({
            charts: new Map([...state.charts].map(([id, measurements]) => {
                if (id === chartId) {
                    return [id, measurements.filter((m) => m.id !== measurementId)];
                }
                return [id, measurements];
            }))
        }));
    }
}));
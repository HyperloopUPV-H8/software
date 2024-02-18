import { create } from 'zustand';

export type ChartId = string;
export type MeasurementId = string;
export type MeasurementName = string;
export type MeasurementColor = string;
export type MeasurementUnits = string;
export type UpdateFunction = () => number;

export type MeasurementInfo = {
  readonly id: MeasurementId;
  readonly name: MeasurementName;
  readonly range: [number | null, number | null];
  readonly color: MeasurementColor;
  readonly units: MeasurementUnits;
  readonly getUpdate: UpdateFunction;
};

type ChartSet = Map<ChartId, MeasurementInfo[]>;

type ChartStore = {
    charts: ChartSet;
    createChart: (chartId: ChartId, initialMeasurement: MeasurementInfo) => void;
    removeChart: (chartId: ChartId) => void;
    addMeasurement: (chartId: ChartId, measurement: MeasurementInfo) => void;
    removeMeasurement: (chartId: ChartId, measurementId: MeasurementId) => void;
};

export const useChartStore = create<ChartStore>((set) => ({
    charts: new Map(),
    createChart: (chartId: ChartId, initialMeasurement: MeasurementInfo) => {
        set(() => ({
            charts: new Map().set(chartId, [initialMeasurement])
        }));
    },
    removeChart: (chartId: ChartId) => {
        set((state) => ({
            charts: new Map([...state.charts].filter(([id, _]) => id !== chartId))
        }));
    },
    addMeasurement: (chartId: ChartId, measurement: MeasurementInfo) => {
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
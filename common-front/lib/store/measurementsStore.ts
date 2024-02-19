import { Measurement, NumericMeasurement, isNumericMeasurement } from "../models";
import {
    getBooleanMeasurement,
    getEnumMeasurement,
    getNumericMeasurement,
    isNumericAdapter,
    PodDataAdapter,
    PacketUpdate,
} from "../adapters";
import { create } from "zustand";

export type Measurements = Record<string, Measurement>
export type MeasurementId = string;
export type MeasurementName = string;
export type MeasurementColor = string;
export type MeasurementUnits = string;
export type UpdateFunction = () => number;
export type NumericMeasurementInfo = {
  readonly id: MeasurementId;
  readonly name: MeasurementName;
  readonly range: [number | null, number | null];
  readonly color: MeasurementColor;
  readonly units: MeasurementUnits;
  readonly getUpdate: UpdateFunction;
};

export interface MeasurementsStore {
    measurements: Measurements;
    packetIdToBoard: Record<number, string>;
    initMeasurements: (podDataAdapter: PodDataAdapter) => void;
    updateMeasurements: (measurements: Record<string, PacketUpdate>) => void
    getMeasurement: (id: MeasurementId) => Measurement;
    getNumericMeasurementInfo: (id: MeasurementId) => NumericMeasurementInfo;
    getMeasurementFallback: (id: MeasurementId) => Measurement;
}

export const useMeasurementsStore = create<MeasurementsStore>((set, get) => ({
    measurements: {},
    packetIdToBoard: {},

    /**
     * Reducer that receives a PodDataAdapter and initializes the measurements
     * and packetIdToBoard map in state.
     * @param {PodDataAdapter} podDataAdapter 
     * @returns {Measurements}
     */
    initMeasurements: (podDataAdapter: PodDataAdapter) => {
        set(state => ({
            ...state,
            measurements: createMeasurementsFromPodDataAdapter(podDataAdapter),
            packetIdToBoard: getPacketIdToBoard(podDataAdapter),
        }))
    },

    /**
     * Reducer that updates the measurements in the state.
     * It receives a measurements map with PacketUpdates, extract the measurements
     * from each of them and updates the measurements.
     * @param {Record<string, PacketUpdate>} measurements 
     */
    updateMeasurements: (measurements: Record<string, PacketUpdate>) => {

        const measurementsDraft = get().measurements;

        for(const update of Object.values(measurements)) {
            for (const [id, mUpdate] of Object.entries(update.measurementUpdates)) {
                const boardName = get().packetIdToBoard[update.id];
                if (!boardName) {
                    continue;
                }

                const measurementId = `${boardName}/${id}`;
                measurementsDraft[measurementId].value = mUpdate;
            }
        }
        set(state => ({
            ...state,
            measurements: measurementsDraft
        }))
    },

    getMeasurement: (id: string) => {
        return get().measurements[id];
    },

    getNumericMeasurementInfo: (id: string) => {
        const meas = get().measurements[id] as NumericMeasurement;
        return {
            id: meas.id,
            name: meas.name,
            units: meas.units,
            range: meas.safeRange,
            getUpdate: () => {
                const meas = get().measurements[id] as NumericMeasurement;
                if (meas == undefined) return 0;
                return meas.value.last;
            },
            color: getRandomColor(),
        };
    },

    getMeasurementFallback: (id: string) => {
        return get().measurements[id] ?? {
            id: "Default",
            name: "Default",
            safeRange: [null, null],
            warningRange: [null, null],
            type: "uint8",
            units: "A",
            value: { average: 0, last: 0 },
        };
    }
}))

function createMeasurementsFromPodDataAdapter(
    podDataAdapter: PodDataAdapter
): Measurements {
    const measurements: Record<string, Measurement> = {};

    for (const board of Object.values(podDataAdapter.boards)) {
        for (const packet of Object.values(board.packets)) {
            for (const adapter of Object.values(packet.measurements)) {
                const id = `${board.name}/${adapter.id}`;
                if (isNumericAdapter(adapter)) {
                    measurements[id] = getNumericMeasurement(id, adapter);
                } else if (adapter.type == "bool") {
                    measurements[id] = getBooleanMeasurement(id, adapter);
                } else {
                    measurements[id] = getEnumMeasurement(id, adapter);
                }
            }
        }
    }

    return measurements;
}

function getPacketIdToBoard(podData: PodDataAdapter) {
    const packetIdToBoard = {} as Record<number, string>;

    for (const board of Object.values(podData.boards)) {
        for (const packet of Object.values(board.packets)) {
            packetIdToBoard[packet.id] = board.name;
        }
    }

    return packetIdToBoard;
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
}
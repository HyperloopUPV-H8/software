import { getPacket, isNumericMeasurement } from "common";
import { useInterval } from "hooks/useInterval";
import { createContext, useRef } from "react";
import { store } from "store";

export type PacketElement = {
    count: Text;
    cycleTime: Text;
};

type MeasurementElement = { value: Text };

type Updater = {
    addPacket: (id: number, element: PacketElement) => void;
    removePacket: (id: number) => void;
    addMeasurement: (id: string, element: MeasurementElement) => void;
    removeMeasurement: (id: string) => void;
};

export const TableContext = createContext<Updater>({
    addPacket() {},
    removePacket() {},
    addMeasurement() {},
    removeMeasurement() {},
});

type Props = {
    children?: React.ReactNode;
};

const TICK_RATE = 60;

export const TableUpdater = ({ children }: Props) => {
    const packetElements = useRef<Record<string, PacketElement>>({});
    const measurementElements = useRef<Record<string, MeasurementElement>>({});

    useInterval(() => {
        const state = store.getState();
        const podData = state.podData;

        for (const id in packetElements.current) {
            const packet = getPacket(podData, Number.parseInt(id));
            const element = packetElements.current[id];
            element.count.nodeValue = packet.count.toFixed(0);
            element.cycleTime.nodeValue = packet.cycleTime.toFixed(0);
        }

        for (const id in measurementElements.current) {
            const measurement = state.measurements[id];
            measurementElements.current[id].value.nodeValue =
                isNumericMeasurement(measurement)
                    ? measurement.value.average.toFixed(3)
                    : measurement.value.toString();
        }
    }, 1000 / TICK_RATE);

    const updater: Updater = {
        addPacket: (id: number, element: PacketElement) => {
            packetElements.current[id] = element;
        },
        removePacket(id) {
            delete packetElements.current[id];
        },
        addMeasurement: (id: string, element: MeasurementElement) => {
            measurementElements.current[id] = element;
        },
        removeMeasurement: (id: string) => {
            delete measurementElements.current[id];
        },
    };

    return (
        <TableContext.Provider value={updater}>
            {children}
        </TableContext.Provider>
    );
};

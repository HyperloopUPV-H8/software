import {
    getMeasurement,
    getPacket,
    isNumericMeasurement,
    useGlobalTicker,
} from "common";
import { useInterval } from "hooks/useInterval";
import { createContext, useRef } from "react";
import { store } from "store";

export type PacketElement = {
    count: Text;
    cycleTime: Text;
};

type MeasurementElement = { boardId: string; measId: string; value: Text };

type Updater = {
    addPacket: (id: number, element: PacketElement) => void;
    removePacket: (id: number) => void;
    addMeasurement: (element: MeasurementElement) => void;
    removeMeasurement: (boardId: string, measId: string) => void;
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
    const measurementElements = useRef<MeasurementElement[]>([]);

    useGlobalTicker(() => {
        const state = store.getState();
        const podData = state.podData;

        for (const id in packetElements.current) {
            const packet = getPacket(podData, Number.parseInt(id));
            const element = packetElements.current[id];
            if (packet) {
                element.count.nodeValue = packet.count.toFixed(0);
                element.cycleTime.nodeValue = packet.cycleTime.toFixed(0);
            }
        }

        for (const item of measurementElements.current) {
            const measurement = getMeasurement(
                state.measurements,
                item.boardId,
                item.measId
            );
            if (!measurement) {
                return;
            }
            const element = measurementElements.current.find(
                (elem) =>
                    elem.boardId == item.boardId && elem.measId == item.measId
            );
            if (!element) {
                return;
            }
            element.value.nodeValue = isNumericMeasurement(measurement)
                ? measurement.value.average.toFixed(3)
                : measurement.value.toString();
        }
    });

    const updater: Updater = {
        addPacket: (id: number, element: PacketElement) => {
            packetElements.current[id] = element;
        },
        removePacket(id) {
            delete packetElements.current[id];
        },
        addMeasurement: (element: MeasurementElement) => {
            if (
                !measurementElements.current.find(
                    (item) =>
                        item.boardId == element.boardId &&
                        item.measId == element.measId
                )
            ) {
                measurementElements.current.push(element);
            }
        },
        removeMeasurement: (boardId: string, measId: string) => {
            measurementElements.current = measurementElements.current.filter(
                (item) => item.boardId != boardId && item.measId == measId
            );
        },
    };

    return (
        <TableContext.Provider value={updater}>
            {children}
        </TableContext.Provider>
    );
};

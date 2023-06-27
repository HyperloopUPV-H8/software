import { PacketUpdate } from "../../adapters";
import { Measurement } from "./Measurement";

export type Packet = {
    id: number;
    name: string;
    hexValue: string;
    count: number;
    cycleTime: number;
    measurements: Measurement[];
};

export function updatePacket(
    boardName: string,
    packet: Packet,
    update: PacketUpdate
) {
    packet.count = update.count;
    packet.cycleTime = update.cycleTime;
    packet.hexValue = update.hexValue;
    updateMeasurements(
        boardName,
        packet.measurements,
        update.measurementUpdates
    );
}

function updateMeasurements(
    boardName: string,
    measurements: Packet["measurements"],
    measurementUpdates: PacketUpdate["measurementUpdates"]
): void {
    for (const [mId, newValue] of Object.entries(measurementUpdates)) {
        const id = `${boardName}/${mId}`;
        const measurement = measurements.find((item) => item.id == id);

        if (!measurement) {
            continue;
        }

        measurement.value = newValue;
    }
}

import { PacketUpdate } from "adapters/PacketUpdate";
import { Measurement } from "models/PodData/Measurement";
import { WritableDraft } from "immer/dist/internal";

export type Packet = {
    id: number;
    name: string;
    hexValue: number;
    count: number;
    cycleTime: number;
    measurements: { [name: string]: Measurement };
};
export function updatePacket(
    packet: WritableDraft<Packet>,
    update: PacketUpdate
) {
    packet.count = update.count;
    packet.cycleTime = update.cycleTime;
    packet.hexValue = update.hexValue;
    updateMeasurements(packet.measurements, update.measurementUpdates);
}

function updateMeasurements(
    measurements: WritableDraft<Packet["measurements"]>,
    measurementUpdates: PacketUpdate["measurementUpdates"]
): void {
    for (let [mName, newValue] of Object.entries(measurementUpdates)) {
        measurements[mName].value = newValue;
    }
}

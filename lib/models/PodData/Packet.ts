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

export function updatePacket(packet: Packet, update: PacketUpdate) {
    packet.count = update.count;
    packet.cycleTime = update.cycleTime;
    packet.hexValue = update.hexValue;
    updateMeasurements(packet.measurements, update.measurementUpdates);
}

function updateMeasurements(
    measurements: Packet["measurements"],
    measurementUpdates: PacketUpdate["measurementUpdates"]
): void {
    for (const [mName, newValue] of Object.entries(measurementUpdates)) {
        const measurement = measurements.find((item) => item.id == mName)!;
        measurement.value = newValue;
    }
}

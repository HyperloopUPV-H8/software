import { MeasurementUpdate } from "@adapters/MeasurementUpdate";
import { PacketUpdate } from "@adapters/PacketUpdate";
import {
  Measurement,
  ValueType,
  createMeasurement,
} from "@models/PodData/Measurement";

export type Packet = {
  id: number;
  name: string;
  hexValue: number;
  count: number;
  cycleTime: number;
  measurements: { [name: string]: Measurement };
};
export function updatePacket(packet: Packet, update: PacketUpdate) {
  packet.count = update.count;
  packet.cycleTime = update.cycleTime;
  packet.cycleTime = update.cycleTime;
  packet.hexValue = update.hexValue;
  updateMeasurements(packet.measurements, update.measurementUpdates);
}

function updateMeasurements(
  measurements: Packet["measurements"],
  measurementUpdates: PacketUpdate["measurementUpdates"]
): void {
  for (let [_, measurement] of Object.entries(measurements)) {
    measurement.value = measurementUpdates[measurement.name];
  }
}

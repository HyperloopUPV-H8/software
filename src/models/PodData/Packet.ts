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
  measurements: Measurement[];
};
export function updatePacket(packet: Packet, update: PacketUpdate) {
  packet.count = update.count;
  packet.cycleTime = update.cycleTime;
  packet.cycleTime = update.cycleTime;
  packet.hexValue = update.hexValue;
  packet.measurements = updateMeasurements(update.measurementUpdates);
}

function updateMeasurements(
  measurementUpdates: MeasurementUpdate[]
): Measurement[] {
  let measurements = new Array();
  for (let update of measurementUpdates) {
    measurements.push(
      createMeasurement(update.name, ValueType.Text, update.value, "deg")
    );
  }
  return measurements;
}

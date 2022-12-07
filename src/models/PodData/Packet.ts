import { PacketUpdate } from "@adapters/PacketUpdate";
import { Measurement, isNumber, getNumber } from "@models/PodData/Measurement";

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
  packet.hexValue = update.hexValue;
  updateMeasurements(packet.measurements, update.measurementUpdates);
}

function updateMeasurements(
  measurements: Packet["measurements"],
  measurementUpdates: PacketUpdate["measurementUpdates"]
): void {
  for (let measurement of Object.values(measurements)) {
    if (isNumber(measurement.type)) {
      measurement.value = getNumber(
        measurement.type,
        measurementUpdates[measurement.name]
      );
    }
  }
}

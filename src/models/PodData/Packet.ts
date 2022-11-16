import { MeasurementUpdate } from "@adapters/MeasurementUpdate";
import { PacketUpdate } from "@adapters/PacketUpdate";
import { Measurement } from "@models/PodData/Measurement";

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
}

function updateMeasurements(
  measurements: Measurement[],
  measurementUpdates: MeasurementUpdate[]
) {
  for (let measurement of measurements) {
    let measurementUpdate = measurementUpdates.find(
      (update) => update.name == measurement.name
    )!;
    measurement.value = measurementUpdate.value;
  }
}

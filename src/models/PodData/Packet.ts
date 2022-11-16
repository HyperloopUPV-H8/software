import { MeasurementUpdate } from "@adapters/MeasurementUpdate";
import { PacketUpdate } from "@adapters/PacketUpdate";
import { Measurement } from "@models/PodData/Measurement";

export class Packet {
  id: number;
  name: string;
  hexValue: number;
  count: number;
  cycleTime: number;
  measurements: Measurement[];

  constructor(
    id: number,
    name: string,
    hexValue: number,
    count: number,
    cycleTime: number,
    measurements: Measurement[]
  ) {
    this.id = id;
    this.name = name;
    this.hexValue = hexValue;
    this.count = count;
    this.cycleTime = cycleTime;
    this.measurements = measurements;
  }

  public update(update: PacketUpdate) {
    this.count = update.count;
    this.cycleTime = update.cycleTime;
    this.cycleTime = update.cycleTime;
  }

  private updateMeasurements(measurementUpdates: MeasurementUpdate[]) {
    for (let measurement of this.measurements) {
      let measurementUpdate = measurementUpdates.find(
        (update) => update.name == measurement.name
      )!;
      measurement.value = measurementUpdate.value;
    }
  }
}

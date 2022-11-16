import { PodData } from "@models/PodData/PodData";
import { Board } from "@models/PodData/Board";
import { Packet } from "@models/PodData/Packet";
import { Measurement, ValueType } from "@models/PodData/Measurement";

export const podDataMock = new PodData([
  new Board("BMS", [
    new Packet(123, "Batteries", 132464, 0, 0, [
      new Measurement("Battery1", ValueType.Number, 0, "volts"),
    ]),
  ]),
]);

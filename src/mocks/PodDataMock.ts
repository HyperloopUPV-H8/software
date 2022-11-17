import type { PodData } from "@models/PodData/PodData";
import { ValueType } from "@models/PodData/Measurement";

export const podDataMock = {
  boards: [
    {
      name: "BMS",
      packets: [
        {
          id: 123,
          name: "Batteries",
          count: 1000,
          cycleTime: 99.99,
          hexValue: 2343,
          measurements: [
            {
              name: "Battery1",
              value: 123,
              type: ValueType.Number,
              units: "Volt",
            },
          ],
        },
      ],
    },
  ],
  lastBatchIDs: [123],
} as PodData;

// ([
//   new Board("BMS", [
//     new Packet(123, "Batteries", 132464, 0, 0, [
//       new Measurement("Battery1", ValueType.Number, 0, "volts"),
//     ]),
//   ]),

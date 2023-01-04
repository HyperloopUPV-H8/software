import { Packet } from "@models/PodData/Packet";

export type Board = {
  name: string;
  packets: { [id: number]: Packet };
  measurementToPacket: { [name: string]: number };
};

import { Packet } from "./Packet";

export type Board = {
    name: string;
    packets: Packet[];
    measurementToPacket: { [name: string]: number };
};

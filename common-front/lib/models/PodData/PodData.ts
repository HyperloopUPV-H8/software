import { PacketUpdate } from "../../adapters"; //TODO: remove dependency
import { Board } from "./Board";
import { Packet, updatePacket } from "./Packet";

export type PodData = {
    boards: Board[];
    packetToBoard: Record<number, number>;
    lastUpdates: Record<string, PacketUpdate>;
};

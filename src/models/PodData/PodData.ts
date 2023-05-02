import { PacketUpdate } from "../../adapters/PacketUpdate";
import { Board } from "./Board";
import { Packet, updatePacket } from "./Packet";

export type PodData = {
    boards: Record<string, Board>;
    packetToBoard: Record<number, string>;
    lastUpdates: Record<number, PacketUpdate>;
};

export function updatePodData(
    podData: PodData,
    packetUpdates: { [id: number]: PacketUpdate }
) {
    for (const update of Object.values(packetUpdates)) {
        const packet = getPacket(podData, update.id);
        updatePacket(packet, update);
    }
}

export function getPacket(podData: PodData, id: number): Packet {
    return podData.boards[podData.packetToBoard[id]].packets[id];
}

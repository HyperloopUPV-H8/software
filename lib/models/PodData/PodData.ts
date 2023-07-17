import { PacketUpdate } from "../../adapters"; //TODO: remove dependency
import { Board } from "./Board";
import { Packet, updatePacket } from "./Packet";

export type PodData = {
    boards: Board[];
    packetToBoard: Record<number, number>;
    lastUpdates: Record<string, PacketUpdate>;
};

export function updatePodData(
    podData: PodData,
    packetUpdates: { [id: number]: PacketUpdate }
) {
    for (const update of Object.values(packetUpdates)) {
        const packet = getPacket(podData, update.id);
        if (packet) {
            const boardIndex = podData.packetToBoard[update.id];

            if (boardIndex === undefined) {
                console.warn(
                    `packet with id ${update.id} not found in packetToBoard`
                );
                continue;
            }

            const board = podData.boards[boardIndex];

            if (!board) {
                console.warn(`board with index ${boardIndex} not found`);
                continue;
            }

            updatePacket(board.name, packet, update);
        } else {
            console.warn(`packet with id ${update.id} not found`);
        }
    }
}

export function getPacket(podData: PodData, id: number): Packet | undefined {
    const board = podData.boards[podData.packetToBoard[id]];

    if (board) {
        return board.packets.find((item) => item.id == id);
    }

    return undefined;
}

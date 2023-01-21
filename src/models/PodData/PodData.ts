import { PacketUpdate } from "adapters/PacketUpdate";
import { Board } from "models/PodData/Board";
import { Packet, updatePacket } from "models/PodData/Packet";
import { Measurement } from "models/PodData/Measurement";
import { WritableDraft } from "immer/dist/internal";

export type PodData = {
    boards: { [name: string]: Board };
    packetToBoard: { [id: number]: string };
    lastUpdates: { [id: number]: PacketUpdate };
};

export function updatePodData(
    podData: WritableDraft<PodData>,
    packetUpdates: { [id: number]: PacketUpdate }
) {
    for (let update of Object.values(packetUpdates)) {
        let packet = getPacket(podData, update.id);
        updatePacket(packet, update);
    }
}

export function getPacket(
    podData: WritableDraft<PodData>,
    id: number
): WritableDraft<Packet> {
    return podData.boards[podData.packetToBoard[id]].packets[id];
}

export function getMeasurement(
    boards: { [key: string]: Board },
    measurementName: string
): Measurement {
    let measurement: Measurement;

    Object.values(boards).forEach((board) => {
        if (
            board.packets[board.measurementToPacket[measurementName]] !=
            undefined
        ) {
            measurement =
                board.packets[board.measurementToPacket[measurementName]]
                    .measurements[measurementName];
        }
    });
    return measurement!;
}

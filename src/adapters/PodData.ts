import { PodData } from "models/PodData/PodData";
import { Board } from "models/PodData/Board";
import { Packet } from "models/PodData/Packet";
import { Measurement } from "models/PodData/Measurement";

export type PodDataAdapter = { boards: { [name: string]: BoardAdapter } };

type BoardAdapter = Omit<Board, "measurementToPacket" | "packets"> & {
    packets: { [id: number]: PacketAdapter };
};

type PacketAdapter = Omit<Packet, "measurements"> & {
    measurements: { [name: string]: MeasurementAdapter };
};

type MeasurementAdapter = Measurement;

export function createPodDataFromAdapter(adapter: PodDataAdapter): PodData {
    let boards: PodData["boards"] = Object.fromEntries(
        Object.values(adapter["boards"]).map((boardAdapter) => {
            let packets = getBoardPackets(boardAdapter.packets);
            let measurementToPacket = getMeasurementToPacket(
                boardAdapter.packets
            );
            return [
                boardAdapter.name,
                { name: boardAdapter.name, packets, measurementToPacket },
            ];
        })
    );

    let packetToBoard = getPacketToBoard(adapter.boards);

    return { boards, packetToBoard, lastUpdates: {} };
}

function getBoardPackets(packets: BoardAdapter["packets"]): Board["packets"] {
    return Object.fromEntries(
        Object.values(packets).map((packetAdapter) => {
            return [
                packetAdapter.id,
                { ...packetAdapter, measurements: packetAdapter.measurements },
            ];
        })
    );
}

function getPacketToBoard(
    boards: PodDataAdapter["boards"]
): PodData["packetToBoard"] {
    let packetToBoard: PodData["packetToBoard"] = {};
    Object.values(boards).forEach((board) => {
        Object.values(board.packets).forEach((packet) => {
            packetToBoard[packet.id] = board.name;
        });
    });
    return packetToBoard;
}

function getMeasurementToPacket(
    packets: BoardAdapter["packets"]
): Board["measurementToPacket"] {
    let measurementToPacket: Board["measurementToPacket"] = {};

    Object.values(packets).forEach((packet) => {
        Object.values(packet.measurements).forEach(
            (m) => (measurementToPacket[m.name] = packet.id)
        );
    });

    return measurementToPacket;
}

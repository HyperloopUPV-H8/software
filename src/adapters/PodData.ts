import { PodData } from "models/PodData/PodData";
import { Board } from "models/PodData/Board";
import { Packet } from "models/PodData/Packet";
import {
    BooleanMeasurement,
    EnumMeasurement,
    Measurement,
    NumericMeasurement,
} from "models/PodData/Measurement";
import { BackendType, NumericType, isNumericType } from "BackendTypes";
import { transformRange } from "slices/measurementsSlice";

export type PodDataAdapter = { boards: { [name: string]: BoardAdapter } };

type BoardAdapter = Omit<Board, "measurementToPacket" | "packets"> & {
    packets: { [id: number]: PacketAdapter };
};

export type PacketAdapter = Omit<Packet, "measurements"> & {
    measurements: { [name: string]: MeasurementAdapter };
};

export type MeasurementAdapter =
    | NumericMeasurementAdapter
    | BooleanMeasurementAdapter
    | EnumMeasurementAdapter;

export type NumericMeasurementAdapter = Omit<
    NumericMeasurement,
    "value" | "safeRange" | "warningRange"
> & {
    safeRange: [number | null, number | null];
    warningRange: [number | null, number | null];
};

export type BooleanMeasurementAdapter = Omit<BooleanMeasurement, "value">;
export type EnumMeasurementAdapter = Omit<EnumMeasurement, "value">;

export function createPodDataFromAdapter(adapter: PodDataAdapter): PodData {
    const boards = Object.fromEntries(
        Object.values(adapter.boards).map((boardAdapter) => {
            const packets = getPackets(boardAdapter.packets);
            const measurementToPacket = getMeasurementToPacket(
                boardAdapter.packets
            );
            return [
                boardAdapter.name,
                { name: boardAdapter.name, packets, measurementToPacket },
            ];
        })
    );

    const packetToBoard = getPacketToBoard(adapter.boards);

    return { boards, packetToBoard, lastUpdates: {} };
}

function getPackets(packets: BoardAdapter["packets"]): Board["packets"] {
    return Object.fromEntries(
        Object.values(packets).map((packetAdapter) => {
            return [
                packetAdapter.id,
                {
                    ...packetAdapter,
                    measurements: getMeasurements(packetAdapter.measurements),
                },
            ];
        })
    );
}

function getMeasurements(
    adapters: Record<string, MeasurementAdapter>
): Record<string, Measurement> {
    return Object.fromEntries(
        Object.values(adapters).map((adapter) => {
            if (isNumericAdapter(adapter)) {
                return [adapter.id, getNumericMeasurement(adapter)];
            } else if (adapter.type == "Enum") {
                return [adapter.id, getEnumMeasurement(adapter)];
            } else {
                return [adapter.id, getBooleanMeasurement(adapter)];
            }
        })
    );
}

export function isNumericAdapter(
    adapter: MeasurementAdapter
): adapter is NumericMeasurementAdapter {
    return isNumericType(adapter.type);
}

export function getNumericMeasurement(
    adapter: NumericMeasurementAdapter
): NumericMeasurement {
    return {
        id: adapter.id,
        name: adapter.name,
        type: adapter.type as NumericType,
        value: {
            average: 0,
            last: 0,
        },
        units: adapter.units,
        safeRange: transformRange(adapter.safeRange),
        warningRange: transformRange(adapter.warningRange),
    };
}

export function getEnumMeasurement(
    adapter: EnumMeasurementAdapter
): EnumMeasurement {
    return {
        id: adapter.id,
        name: adapter.name,
        type: adapter.type as "Enum",
        value: "Default",
    };
}

export function getBooleanMeasurement(
    adapter: BooleanMeasurementAdapter
): BooleanMeasurement {
    return {
        id: adapter.id,
        name: adapter.name,
        type: adapter.type as "bool",
        value: false as boolean,
    };
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
            (m) => (measurementToPacket[m.id] = packet.id)
        );
    });

    return measurementToPacket;
}

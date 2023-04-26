import { RootState } from "store";
import { TreeNode } from "./Sidebar/TreeNode";
import { Board } from "common";
import { Packet } from "common";
import { isNumber } from "common";

export function selectNumericPodDataNames(state: RootState): TreeNode {
    let boards = {};

    //FIXME: remove type assertion
    Object.values(state.podData.boards as Record<string, Board>).forEach(
        (board) => {
            let packets = getNumericPacketNames(board);
            if (packets) {
                Object.assign(boards, { [board.name]: packets });
            }
        }
    );

    return boards;
}

function getNumericPacketNames(board: Board): TreeNode | undefined {
    let packets = {};

    Object.values(board.packets).forEach((packet) => {
        let measurements = getNumericMeasurementNames(packet);
        if (measurements) {
            Object.assign(packets, { [packet.name]: measurements });
        }
    });

    if (Object.entries(packets).length > 0) {
        return packets;
    } else {
        return undefined;
    }
}

function getNumericMeasurementNames(packet: Packet): TreeNode | undefined {
    let measurements = {} as TreeNode;
    Object.values(packet.measurements).forEach((measurement) => {
        if (isNumber(measurement.type)) {
            Object.assign(measurements, { [measurement.id]: undefined });
        }
    });

    if (Object.entries(measurements).length > 0) {
        return measurements;
    } else {
        return undefined;
    }
}

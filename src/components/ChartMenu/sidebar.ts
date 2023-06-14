import { RootState } from "store";
import { Board, PodData, isNumericMeasurement } from "common";
import { Packet } from "common";
import { Section } from "./Sidebar/Section/Section";
import { Subsection } from "./Sidebar/Section/Subsection/Subsection/Subsection";
import { Item } from "./Sidebar/Section/Subsection/Subsection/Items/Item/ItemView";

export function createSidebarSections(podData: PodData): Section[] {
    const sections: Section[] = [];

    podData.boards.forEach((board) => {
        const subsections = getNumericPacketSubsections(board);
        if (subsections.length > 0) {
            sections.push({ name: board.name, subsections });
        }
    });

    return sections;
}

function getNumericPacketSubsections(board: Board): Subsection[] {
    const packets: Subsection[] = [];

    board.packets.forEach((packet) => {
        const items = getNumericMeasurementItems(packet, board.name);
        if (items.length > 0) {
            packets.push({ name: packet.name, items });
        }
    });

    return packets;
}

function getNumericMeasurementItems(packet: Packet, board: string): Item[] {
    const items: Item[] = [];
    packet.measurements.forEach((measurement) => {
        if (isNumericMeasurement(measurement)) {
            items.push({
                id: `${board}/${measurement.id}`,
                name: measurement.name,
            });
        }
    });
    return items;
}

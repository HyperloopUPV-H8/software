import { PacketUpdate } from "@adapters/PacketUpdate";
import { Board } from "@models/PodData/Board";
import { Packet, updatePacket } from "@models/PodData/Packet";

export type PodData = {
  boards: Board[];
  lastBatchIDs: number[];
};

export function setLastBatchIDs(podData: PodData, updates: PacketUpdate[]) {
  podData.lastBatchIDs = updates.map((update) => update.id);
}

export function updatePodData(podData: PodData, updates: PacketUpdate[]) {
  for (let update of updates) {
    let packet = getPacket(podData, update.id);
    updatePacket(packet, update);
  }
}

function getPacket(podData: PodData, id: number): Packet {
  let board = podData.boards.find((board) => {
    return board.packets.some((packet) => {
      packet.id == id;
    });
  })!;

  let packet = board.packets.find((packet) => {
    return packet.id == id;
  })!;

  return packet;
}

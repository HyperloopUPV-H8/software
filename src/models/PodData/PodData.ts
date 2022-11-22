import { PacketUpdate } from "@adapters/PacketUpdate";
import { Board } from "@models/PodData/Board";
import { Packet, updatePacket } from "@models/PodData/Packet";

export type PodData = {
  boards: { [name: string]: Board };
  lastBatchIDs: number[];
};

export function createEmptyPodData(): PodData {
  return { boards: {}, lastBatchIDs: [] };
}

export function setLastBatchIDs(
  podData: PodData,
  updates: { [id: number]: PacketUpdate }
) {
  for (let id of Object.keys(updates)) {
    podData.lastBatchIDs.push(Number.parseInt(id));
  }
}

export function updatePodData(
  podData: PodData,
  packetUpdates: { [id: number]: PacketUpdate }
) {
  for (let [name, update] of Object.entries(packetUpdates)) {
    let packet = getPacket(podData, update.id)!;
    updatePacket(packet, update);
  }
}

function getPacket(podData: PodData, id: number): Packet | undefined {
  for (let [_, board] of Object.entries(podData.boards)) {
    for (let [_, packet] of Object.entries(board.packets)) {
      if (packet.id == id) {
        return packet;
      }
    }
  }
}

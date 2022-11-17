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
    updatePacket(packet!, update);
  }
}

function getPacket(podData: PodData, id: number): Packet | undefined {
  for (let b of podData.boards) {
    for (let p of b.packets) {
      if (p.id == id) {
        return p
      }
    }
  }
}

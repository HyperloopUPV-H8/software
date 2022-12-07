import { PacketUpdate } from "@adapters/PacketUpdate";
import { Board } from "@models/PodData/Board";
import { Packet, updatePacket } from "@models/PodData/Packet";
import { Measurement } from "@models/PodData/Measurement";

//TODO: optimizar poddata metiendo mapas extras de ID a board y MName a P Id.
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
  podData.lastBatchIDs = Object.keys(updates).map((key) => {
    return Number.parseInt(key);
  });
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

export function selectMeasurementByName(
  boards: { [key: string]: Board },
  name: string
): Measurement {
  let measurement: Measurement;
  OuterLoop: for (let board of Object.values(boards)) {
    let packets = Object.values(board.packets);
    for (let packet of packets) {
      if (name in packet.measurements) {
        measurement = packet.measurements[name];
        break OuterLoop;
      }
    }
  }
  return measurement!;
}

import { PacketUpdate } from "@adapters/PacketUpdate";
import { Board } from "@models/PodData/Board";
import { Packet } from "@models/PodData/Packet";

export class PodData {
  boards: Board[];
  lastBatchIDs: number[] = [];

  constructor(boards: Board[]) {
    this.boards = boards;
  }

  public setLastBatchIDs(updates: PacketUpdate[]) {
    this.lastBatchIDs = updates.map((update) => update.id);
  }

  public update(updates: PacketUpdate[]) {
    for (let update of updates) {
      let packet = this.getPacket(update.id);
      packet.update(update);
    }
  }

  private getPacket(id: number): Packet {
    let board = this.boards.find((board) => {
      return board.packets.some((packet) => {
        packet.id == id;
      });
    })!;

    let packet = board.packets.find((packet) => {
      return packet.id == id;
    })!;

    return packet;
  }
}

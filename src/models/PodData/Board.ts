import { Packet } from "@models/PodData/Packet";

export class Board {
  name: string;
  packets: Packet[];

  constructor(name: string, packets: Packet[]) {
    this.name = name;
    this.packets = packets;
  }

  // public updatePacket(id: number) {
  //   let packet = this.packets.get(id)!;
  //   this.packets.set(id, { ...packet, value: value });
  // }
}

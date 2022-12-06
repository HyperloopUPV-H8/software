import { Connection } from "@models/Connection";

export const ConnectionsMock: Connection[] = [
  { name: "Packets", isConnected: false },
  { name: "Orders", isConnected: true },
  { name: "Connections", isConnected: true },
];
export const BoardConnectionsMock: Connection[] = [
  { name: "BMS", isConnected: false },
  { name: "Master", isConnected: true },
  { name: "HEMS", isConnected: false },
];

import { Connection } from "@models/Connection";

export const ConnectionsMock: Connection[] = [
  { name: "Conexión1", isConnected: false },
  { name: "Conexión2", isConnected: true },
  { name: "Conexión3", isConnected: false },
  { name: "Conexión4", isConnected: true },
  { name: "Conexión5", isConnected: true },
];
export const BoardConnectionsMock: Connection[] = [
  { name: "BMS", isConnected: false },
  { name: "Master", isConnected: true },
  { name: "HEMS", isConnected: false },
];

// Types for the ADJ archive fetched from GitHub Pages.

export interface AdjMeasurement {
  id: string;
  name: string;
  type: string;
  podUnits?: string;
  displayUnits?: string;
  enumValues?: string[];
}

export interface AdjPacket {
  id: number;
  name: string;
  // "data" packets carry telemetry; "order" packets are commands sent to a board.
  type: "data" | "order" | string;
  variables: string[];
  period?: number;
  period_type?: string;
  socket?: string;
}

// The inner board config object stored under the board's own name key.
export interface AdjBoardInfo {
  board_id: number;
  board_ip: string;
  // Path references to definition files — not embedded objects.
  measurements: string[];
  packets: string[];
}

// boards[boardName] is a nested group, not a flat object.
// Keys: boardName (AdjBoardInfo), `${boardName}_measurements` (AdjMeasurement[]),
//       "packets", "packets_old", "orders", "orders_old" (AdjPacket[]).
export type AdjBoardGroup = Record<string, AdjBoardInfo | AdjMeasurement[] | AdjPacket[] | unknown>;

export interface AdjArchive {
  boards: Record<string, AdjBoardGroup>;
  general_info: {
    ports: Record<string, number>;
    addresses: Record<string, string>;
    // Unit conversion expressions (e.g. "/1000" to convert mm→m). CONVERSION ALREADY MADE BY THE BACKEND.
    units: Record<string, string>;
    message_ids: Record<string, number>;
  };
}

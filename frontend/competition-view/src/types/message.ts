/** Severities sent by the backend (see backend/pkg/transport/packet/protection Severity, plus the hardcoded "info" used for order-sent notices). */
export type MessageKind = "info" | "warning" | "fault" | "ok";

/**
 * Wall-clock timestamp as sent by the backend RTC (protection.Timestamp).
 * There's no timezone concept here — it's raw RTC fields, so display them
 * as-is rather than routing through `Date`/UTC conversion.
 */
export interface MessageTimestamp {
  counter: number;
  second: number;
  minute: number;
  hour: number;
  day: number;
  month: number;
  year: number;
}

/** Detailed protection payload for warning/fault/ok messages. */
export type MessageDetailedPayload =
  | { kind: "LOWER_BOUND" | "UPPER_BOUND"; data: { bound: number; value: number } }
  | { kind: "OUT_OF_BOUNDS"; data: { bounds: [number, number]; value: number } }
  | { kind: "EQUALS"; data: { value: number } }
  | { kind: "NOT_EQUALS"; data: { want: number; value: number } }
  | { kind: "TIME_ACCUMULATION"; data: { value: number; bound: number; timelimit: number } }
  | { kind: "ERROR_HANDLER" | "WARNING"; data: string };

/** Raw packet shape sent by the backend over the `message/update` WebSocket topic. */
export interface MessagePacket {
  kind: MessageKind;
  /** A plain string for "info" (order-sent) messages; a detailed object for warning/fault/ok. */
  payload: string | MessageDetailedPayload;
  board: string;
  name: string;
  timestamp: MessageTimestamp;
}

/** Message definition on the frontend — the wire packet plus a client-generated id. */
export interface Message extends MessagePacket {
  id: string;
}

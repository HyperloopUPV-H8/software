import type { MessagePacket, MessageTimestamp } from "../types/message";

/** `HH:MM:SS` straight from the backend RTC fields — no Date/timezone conversion. */
export const formatMessageTimestamp = (ts: MessageTimestamp | undefined): string => {
  if (!ts) return "--:--:--";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(ts.hour)}:${pad(ts.minute)}:${pad(ts.second)}`;
};

/** Caps a raw telemetry float to 2 decimal places for display. */
const fmt = (n: number): string => (Number.isFinite(n) ? n.toFixed(2) : String(n));

/** Human-readable text for a message's payload, whether it's a plain string or a detailed protection object. */
export const messageContent = (payload: MessagePacket["payload"]): string => {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return "No detail available";

  const { kind, data } = payload;
  if (typeof data === "string") return data;

  switch (kind) {
    case "OUT_OF_BOUNDS":
      return `Value: ${fmt(data.value)} (Bounds: [${fmt(data.bounds[0])}, ${fmt(data.bounds[1])}])`;
    case "UPPER_BOUND":
    case "LOWER_BOUND":
      return `Value: ${fmt(data.value)} (Limit: ${fmt(data.bound)})`;
    case "EQUALS":
      return `Value: ${fmt(data.value)}`;
    case "NOT_EQUALS":
      return `Value: ${fmt(data.value)} (Expected: ${fmt(data.want)})`;
    case "TIME_ACCUMULATION":
      return `Value: ${fmt(data.value)} for ${fmt(data.timelimit)}s (Limit: ${fmt(data.bound)})`;
    default:
      return JSON.stringify(data);
  }
};

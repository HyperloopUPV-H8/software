import type { MessagePacket, MessageTimestamp } from "../types/message";

/** `HH:MM:SS` straight from the backend RTC fields — no Date/timezone conversion. */
export const formatMessageTimestamp = (ts: MessageTimestamp | undefined): string => {
  if (!ts) return "--:--:--";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(ts.hour)}:${pad(ts.minute)}:${pad(ts.second)}`;
};

/** Human-readable text for a message's payload, whether it's a plain string or a detailed protection object. */
export const messageContent = (payload: MessagePacket["payload"]): string => {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return "No detail available";

  const { kind, data } = payload;
  if (typeof data === "string") return data;

  switch (kind) {
    case "OUT_OF_BOUNDS":
      return `Value: ${data.value} (Bounds: [${data.bounds[0]}, ${data.bounds[1]}])`;
    case "UPPER_BOUND":
    case "LOWER_BOUND":
      return `Value: ${data.value} (Limit: ${data.bound})`;
    case "EQUALS":
      return `Value: ${data.value}`;
    case "NOT_EQUALS":
      return `Value: ${data.value} (Expected: ${data.want})`;
    case "TIME_ACCUMULATION":
      return `Value: ${data.value} for ${data.timelimit}s (Limit: ${data.bound})`;
    default:
      return JSON.stringify(data);
  }
};

/**
 * Shared colour classification for board/state telemetry strings.
 *
 * Board state enums aren't fixed in the ADJ (they're free-form strings sent
 * by each board's firmware), so this classifies by keyword instead of an
 * exhaustive list. Order matters: danger is checked first so e.g.
 * "DISCONNECTED" (danger) isn't mistaken for "CONNECTED" (nominal).
 */
type StateLevel = "danger" | "caution" | "info" | "nominal" | "neutral";

const DANGER_KEYWORDS = [
  "FAULT", "ERROR", "EMERGENCY", "DISENGAG", "DISCONNECT", "TIMEOUT", "ABORT",
];

const CAUTION_KEYWORDS = [
  "CONNECTING", "PRECHARG", "DISCHARG", "CALIBRAT", "WARN",
  "BRAKE", "DECELER", "ENERGIZ", "HVACTIVE", "PENDING",
];

/** Subsystem-specific operating modes, called out in blue rather than generic green. */
const INFO_KEYWORDS = [
  "LEVITAT", "PROPULSION",
];

const NOMINAL_KEYWORDS = [
  "RUN", "NOMINAL", "ACCELERAT", "CONNECTED",
  "CLOSED", "ENGAGED", "OPERATIONAL", "READY", "OK",
];

const stateLevel = (state: string | number | boolean | undefined): StateLevel => {
  if (state === undefined) return "neutral";
  const s = String(state).toUpperCase();
  if (DANGER_KEYWORDS.some((k) => s.includes(k))) return "danger";
  if (CAUTION_KEYWORDS.some((k) => s.includes(k))) return "caution";
  if (INFO_KEYWORDS.some((k) => s.includes(k))) return "info";
  if (NOMINAL_KEYWORDS.some((k) => s.includes(k))) return "nominal";
  return "neutral";
};

/** Text-only colour for a state string (e.g. inline labels). */
export const stateTextClass = (state: string | number | boolean | undefined): string => {
  switch (stateLevel(state)) {
    case "danger":   return "text-red-500";
    case "caution":  return "text-amber-500";
    case "info":     return "text-blue-500";
    case "nominal":  return "text-green-500";
    case "neutral":  return "text-muted-foreground";
  }
};

/** Same classification as {@link stateTextClass}, but as a full badge (border + tint + text). */
export const stateBadgeClass = (state: string | number | boolean | undefined): string => {
  switch (stateLevel(state)) {
    case "danger":
      return "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
    case "caution":
      return "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "info":
      return "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "nominal":
      return "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400";
    case "neutral":
      return "border-muted-foreground/30 text-muted-foreground";
  }
};

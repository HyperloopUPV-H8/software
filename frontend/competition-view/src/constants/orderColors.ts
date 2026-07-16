/**
 * Colour coding for VCU order buttons, echoing the same danger/caution/
 * info/nominal/neutral vocabulary used for vehicle state badges
 * (see lib/stateColor.ts) so an order's colour hints at what it does to
 * the vehicle's safety posture rather than just being decorative.
 */
export type OrderColorLevel = "danger" | "caution" | "nominal" | "info" | "neutral" | "special";

/**
 * Level per gated VCU order id (see constants/vcuStateMachine.ts).
 * - danger:  FAULT — forces a fault state. Rendered as its own big button, not this grid.
 * - caution: leaves a safe state or energises something (Stop, Precharge).
 * - nominal: returns to a safer state (Brake).
 * - info:    active operating modes (Static/Dynamic Levitation, Propulsion).
 * - neutral: administrative, no direct safety impact (Maintenance).
 * - special: called out distinctly (Unbrake).
 */
export const VCU_ORDER_COLOR_LEVELS: Record<number, OrderColorLevel> = {
  0:  "danger",   // Fault
  30: "caution",  // Stop
  40: "neutral",  // Maintenance
  41: "caution",  // Precharge
  50: "special",  // Unbrake
  51: "nominal",  // Brake
  60: "info",     // Static Levitation
  61: "info",     // Propulsion
  62: "info",     // Dynamic Levitation
};

/** Solid button colour classes for a given level (text-on-fill, so contrast holds in both themes). */
export const orderButtonColorClass = (level: OrderColorLevel): string => {
  switch (level) {
    case "danger":
      return "bg-red-600 hover:bg-red-700 text-white border-red-600";
    case "caution":
      return "bg-amber-500 hover:bg-amber-600 text-white border-amber-500";
    case "nominal":
      return "bg-green-600 hover:bg-green-700 text-white border-green-600";
    case "info":
      return "bg-blue-600 hover:bg-blue-700 text-white border-blue-600";
    case "neutral":
      return "bg-muted hover:bg-muted/70 text-foreground border-border";
    case "special":
      return "bg-purple-600 hover:bg-purple-700 text-white border-purple-600";
  }
};

/**
 * Hardcoded order IDs used during competition, sourced from the ADJ
 * repository (branch: Astra).
 * Each ID maps to a backend command understood by the VCU/HV system.
 *
 * The running backend currently only has the VCU board enabled
 * (see backend/cmd/config.toml `[vehicle].boards`), so these quick
 * actions are scoped to VCU-native orders — PCU/HVBMS order IDs won't
 * route anywhere until those boards are added back to the config.
 */

export interface OrderFieldValue {
  value: unknown;
  isEnabled: boolean;
  type: string;
}

export interface Order {
  id: number;
  fields: Record<string, OrderFieldValue>;
}

/** Engages the brakes (VCU "Brake"). */
export const BRAKE_ORDERS: Order[] = [
  { id: 51, fields: {} },
];

/** Opens the contactors to cut power (VCU "Open Contactors"). */
export const OPEN_CONTACTORS_ORDERS: Order[] = [
  { id: 42, fields: {} },
];

/**
 * Full emergency stop sequence:
 * triggers emergency brake + brings the vehicle to a full stop
 * + opens contactors to cut power + forces FAULT (all VCU orders).
 */
export const EMERGENCY_STOP_ORDERS: Order[] = [
  { id: 51, fields: {} },
  { id: 30, fields: {} },
  { id: 42, fields: {} },
  { id: 0,  fields: {} },
];

/** Forces a FAULT state (id 0 is shared by the FAULT order on every board). */
export const FAULT_ORDERS: Order[] = [
  { id: 0, fields: {} },
];

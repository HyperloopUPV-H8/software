export const VCU_STATES = [
  "Idle",
  "Connected",
  "Maintenance",
  "Precharging",
  "HVActive",
  "Ready",
  "Propulsion",
  "Static Levitation",
  "Dynamic Levitation",
  "Fault",
] as const;

export type VcuState = (typeof VCU_STATES)[number];

export const VCU_GATED_ORDER_IDS = [0, 30, 40, 41, 50, 51, 60, 61, 62] as const;

const VCU_ORDER_STATE_MATRIX: readonly (0 | 1)[][] = [
  /* Idle               */ [1, 0, 0, 0, 0, 0, 0, 0, 0],
  /* Connected          */ [1, 0, 1, 1, 0, 0, 0, 0, 0],
  /* Maintenance        */ [1, 1, 0, 0, 0, 0, 0, 0, 0],
  /* Precharging        */ [1, 1, 0, 0, 0, 0, 0, 0, 0],
  /* HVActive           */ [1, 1, 0, 0, 1, 0, 0, 0, 0],
  /* Ready              */ [1, 1, 0, 0, 0, 1, 1, 1, 0],
  /* Propulsion         */ [1, 1, 0, 0, 0, 1, 0, 0, 1],
  /* Static Levitation  */ [1, 1, 0, 0, 0, 1, 0, 0, 1],
  /* Dynamic Levitation */ [1, 1, 0, 0, 0, 1, 0, 0, 0],
  /* Fault              */ [1, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const isVcuOrderAllowedInState = (orderId: number, state: string | undefined): boolean => {
  const stateIndex = VCU_STATES.findIndex((s) => s === state);
  if (stateIndex === -1) return false;

  const orderIndex = VCU_GATED_ORDER_IDS.indexOf(orderId as (typeof VCU_GATED_ORDER_IDS)[number]);
  if (orderIndex === -1) return true;

  return VCU_ORDER_STATE_MATRIX[stateIndex][orderIndex] === 1;
};

/** Column index of the FAULT order (always shown separately, not part of the grid). */
const FAULT_COLUMN_INDEX = VCU_GATED_ORDER_IDS.indexOf(0);

/**
 * Largest number of non-FAULT orders enabled in any single state (currently
 * Ready: Stop/Brake/Static Levitation/Propulsion = 4). Used to size the
 * order button grid to the worst case so it doesn't grow/shrink as the
 * vehicle transitions between states.
 */
export const VCU_MAX_ORDERS_PER_STATE = Math.max(
  ...VCU_ORDER_STATE_MATRIX.map((row) =>
    row.reduce<number>((sum, enabled, i) => (i === FAULT_COLUMN_INDEX ? sum : sum + enabled), 0),
  ),
);

/**
 * Backend telemetry measurement IDs and board names sourced from the ADJ
 * repository (branch: astra-wip4).
 *
 * IDs are the raw values sent by the backend inside `measurementUpdates`.
 * The BOARDS map provides the board name needed for the two-level lookup
 * `telemetry[board][measurementId]` that prevents cross-board collisions.
 */

/** Board names as reported by the backend (from the ADJ). */
export const BOARDS = {
  VCU:   "VCU",
  PCU:   "PCU",
  LCU:   "LCU",
  HVBMS: "HVBMS",
} as const;

export const VCU = {
  generalState:       "general_state",
  operationalState:   "operational_state",
  highPressure:       "high_pressure",
  lowPressure:        "low_pressure",
  sdcClosed:          "sdc_closed",
  contactorsClosed:   "contactors_closed",
  activeBrakes:       "active_brakes",
  brakeFault:         "brake_fault_detected",
  // Sub-system states as orchestrated by the VCU
  hvbmsState:         "hvbms_state",
  pcuState:           "pcu_state",
  lcuVerticalState:   "lcu_vertical_state",
  lcuHorizontalState: "lcu_horizontal_state",
} as const;

export const PCU = {
  speed:         "encoder_speed_km_h",
  position:      "encoder_position",
  acceleration:  "encoder_acceleration",
  motorCurrentU: "current_sensor_u_a",
  motorCurrentV: "current_sensor_v_a",
  motorCurrentW: "current_sensor_w_a",
} as const;

export const PCU_BOARD = {
  generalState:   "general_state_machine",
  operatingState: "operational_state_machine",
  peakCurrent:    "current_Peak",
  frequency:      "frequency",
} as const;

/** HVBMS — high-voltage battery management system. */
export const HVBMS = {
  minimumSoc:          "minimum_soc",
  soc:                 "soc",
  voltageReading:      "voltage_reading",
  batteriesVoltage:    "batteries_voltage_reading",
  currentReading:      "current_reading",
  tempMax:             "temp_max",
  tempMin:             "temp_min",
  voltageMax:          "voltage_max",
  voltageMin:          "voltage_min",
  imdOk:               "imd_is_ok",
  imdStatus:           "imd_status",
  imdResistance:       "imd_resistance",
  sdcStatus:           "sdc_status",
  operationalState:    "gsm_status",
  contactorPrecharge:  "contactor_precharge",
  contactorDischarge:  "contactor_discharge",
  contactorHigh:       "contactor_high",
  contactorLow:        "contactor_low",
  contactorCommonHigh: "contactor_common_high",
} as const;

/** Per-group indices are 1-based (1–8). Each group has 12 cells. */
export const hvbmsPack = (n: number) => ({
  voltage: `battery${n}_total_voltage`,
  tempMax: `battery${n}_max_temp`,
  tempMin: `battery${n}_min_temp`,
  cells:   Array.from({ length: 12 }, (_, i) => `battery${n}_cell${i + 1}`),
});

/** LCU — levitation control unit. */
export const LCU = {
  // Airgaps 1–4: vertical, 5–8: lateral/horizontal
  verticalAirgap1:   "airgap_1",
  verticalAirgap2:   "airgap_2",
  verticalAirgap3:   "airgap_3",
  verticalAirgap4:   "airgap_4",
  horizontalAirgap1: "airgap_5",
  horizontalAirgap2: "airgap_6",
  horizontalAirgap3: "airgap_7",
  horizontalAirgap4: "airgap_8",
  masterState:       "master_state_machine",
  slaveState:        "slave_state_machine",
  // Coil currents: 1–4 = HEMS (vertical), 5–10 = EMS (lateral)
  coilCurrentHEMS1:  "coil_current_1",
  coilCurrentHEMS2:  "coil_current_2",
  coilCurrentHEMS3:  "coil_current_3",
  coilCurrentHEMS4:  "coil_current_4",
  coilCurrentEMS1:   "coil_current_5",
  coilCurrentEMS2:   "coil_current_6",
  coilCurrentEMS3:   "coil_current_7",
  coilCurrentEMS4:   "coil_current_8",
  coilCurrentEMS5:   "coil_current_9",
  coilCurrentEMS6:   "coil_current_10",
} as const;

/**
 * Backend telemetry measurement IDs and board names sourced from the ADJ
 * repository (branch: Astra).
 *
 * IDs are the raw values sent by the backend inside `measurementUpdates`.
 * The BOARDS map provides the board name needed for the two-level lookup
 * `telemetry[board][measurementId]` that prevents cross-board collisions.
 */

/** Board names as reported by the backend (from the ADJ). */
export const BOARDS = {
  VCU:           "VCU",
  PCU:           "PCU",
  LCU:           "LCU",
  HVBMS:         "HVBMS",
  HVSCU_CABINET: "HVSCU-Cabinet",
} as const;

export const VCU = {
  state:                   "state",
  highPressure:            "high_pressure",
  lowPressure:             "low_pressure",
  pressureRegulatorFdbk:   "pressure_regulator_feedback",
  sdcClosed:               "sdc_closed",
  activeBrakes:            "active_brakes",
  brakeFault:              "brake_fault_detected",
  electrovalveEnabled:     "electrovalve_enabled",
  // Sub-board connectivity as reported by the VCU
  hvbmsConnected:          "hvbms_connected",
  pcuConnected:            "pcu_connected",
  lcuConnected:            "lcu_connected",
  propulsionTargetSpeed:   "propulsion_target_speed",
  propulsionMaxCurrent:    "propulsion_max_current",
  levitationTargetHeight:  "levitation_target_height",
} as const;

export const PCU = {
  speed:         "imu_speed_km_h",
  position:      "imu_position_m",
  motorCurrentU: "current_sensor_u_a",
  motorCurrentV: "current_sensor_v_a",
  motorCurrentW: "current_sensor_w_a",
} as const;

export const PCU_BOARD = {
  state:        "state",
  peakCurrent:  "current_Peak",
  frequency:    "frequency",
} as const;

/** DC link voltage (HVBMS.voltageReading) threshold above which HVAL is considered active. */
export const HVAL_THRESHOLD_V = 60;

/** HVBMS — high-voltage battery management system. */
export const HVBMS = {
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
  operationalState:    "sm_status",
  contactorPrecharge:  "contactor_precharge",
  contactorDischarge:  "contactor_discharge",
  contactorHigh:       "contactor_high",
  contactorLow:        "contactor_low",
  contactorCommonHigh: "contactor_common_high",
} as const;

/** Per-group indices are 1-based (1–8). Each group has 12 cells and 4 temp sensors. */
export const hvbmsPack = (n: number) => ({
  voltage: `battery${n}_total_voltage`,
  temps:   Array.from({ length: 4 }, (_, i) => `battery${n}_temp${i + 1}`),
  cells:   Array.from({ length: 12 }, (_, i) => `battery${n}_cell${i + 1}`),
});

/** HVSCU-Cabinet — booster supercapacitor cabinet. */
export const HVSCU_CABINET = {
  // DC bus voltage feeding the PCU inverter, i.e. the DC link voltage.
  dcLinkVoltage: "HVSCU-Cabinet_bus_voltage",
} as const;

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

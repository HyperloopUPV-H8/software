import { Measurements, NumericMeasurement, useMeasurementsStore } from '..';

export const PcuMeasurements = {
    motorAPeakCurrent: 'PCU/peak_current',
    motorACurrentU: 'PCU/motor_a_current_u',
    motorACurrentV: 'PCU/motor_a_current_v',
    motorACurrentW: 'PCU/motor_a_current_w',
    motorATemp: 'PCU/motor_a_temp_u',
    motorBPeakCurrent: 'PCU/peak_current',
    motorBCurrentU: 'PCU/motor_b_current_u',
    motorBCurrentV: 'PCU/motor_b_current_v',
    motorBCurrentW: 'PCU/motor_b_current_w',
    motorBTemp: 'PCU/motor_b_temp_v',
    frequency: 'PCU/target_frequency',
    generalState: 'PCU/general_state',
    specificState: 'PCU/operating_state',
};

export const PcuOrders = {};

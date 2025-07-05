import { Measurements, NumericMeasurement, useMeasurementsStore } from '..';

export const PcuMeasurements = {
    motorAPeakCurrent: 'PCU/peak_current',
    motorACurrentU: 'PCU/current_sensor_u_a',
    motorACurrentV: 'PCU/current_sensor_v_a',
    motorACurrentW: 'PCU/current_sensor_w_a',
    motorATemp: 'PCU/motor_a_temp_u',
    motorBPeakCurrent: 'PCU/peak_current',
    motorBCurrentU: 'PCU/current_sensor_u_a',
    motorBCurrentV: 'PCU/current_sensor_v_a',
    motorBCurrentW: 'PCU/current_sensor_w_a',
    motorBTemp: 'PCU/motor_b_temp_v',
    frequency: 'PCU/target_frequency',
    generalState: 'PCU/general_state',
    specificState: 'PCU/operating_state',
};

export const PcuOrders = {};

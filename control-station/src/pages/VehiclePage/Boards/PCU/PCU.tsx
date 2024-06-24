import styles from './PCU.module.scss';
import { Window } from 'components/Window/Window';
import {
    ColorfulChart,
    LineDescription,
    Measurement,
    MeasurementId,
    NumericMeasurement,
    PcuMeasurements,
    isNumericMeasurement,
    useMeasurementsStore,
} from 'common';
import DLIM from 'assets/svg/dlim.svg';

export const PCU = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );

    const motorACurrentU = getNumericMeasurementInfo(
        PcuMeasurements.motorACurrentU
    );
    const motorACurrentV = getNumericMeasurementInfo(
        PcuMeasurements.motorACurrentV
    );
    const motorACurrentW = getNumericMeasurementInfo(
        PcuMeasurements.motorACurrentW
    );

    return (
        <Window title="PCU">
            <div className={styles.container}>
                <img src={DLIM} alt="DLIM" />

                <div className={styles.content}>
                    <ColorfulChart
                        title="Motor A"
                        length={100}
                        items={[motorACurrentU, motorACurrentV, motorACurrentW]}
                    />
                </div>

                <img
                    src={DLIM}
                    alt="DLIM"
                    style={{ transform: 'rotate(180deg' }}
                />
            </div>
        </Window>
    );
};

function getItemFromMeasurement(
    meas: NumericMeasurement,
    getMeasurement: (id: MeasurementId) => Measurement
): LineDescription {
    return {
        id: meas.id,
        name: meas.name,
        color: 'red',
        getUpdate: () => getMeasurementValue(meas.id, getMeasurement),
        range: meas.safeRange,
    };
}

function getMeasurementValue(
    id: string,
    getMeasurement: (id: MeasurementId) => Measurement
): number {
    const measurement = getMeasurement(id);

    if (!measurement) {
        return 0;
    }

    if (isNumericMeasurement(measurement)) {
        return measurement.value.last;
    } else {
        return 0;
    }
}

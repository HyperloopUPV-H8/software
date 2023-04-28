import { RootState } from "store";
import styles from "./MeasurementView.module.scss";
import { Measurement, isNumericMeasurement } from "common";
import { useSelector } from "react-redux";
import { memo } from "react";
type Props = {
    measurement: Measurement;
};

function measurementSelector(state: RootState, id: string): Measurement {
    return state.measurements[id];
}

export const MeasurementView = ({ measurement }: Props) => {
    // const measurement = useSelector((state: RootState) =>
    //     measurementSelector(state, id)
    // );

    const isNumeric = isNumericMeasurement(measurement);

    return (
        <div className={styles.measurementView}>
            <span className={styles.name}>{measurement.name}</span>
            {isNumeric && (
                <>
                    <span className={styles.value}>
                        {measurement.value.average.toFixed(3)}
                    </span>
                    <span className={styles.units}>{measurement.units}</span>
                    <span className={styles.type}>{measurement.type}</span>
                </>
            )}
            {!isNumeric && (
                <>
                    <span className={styles.value}>
                        {measurement.value.toString()}
                    </span>
                    <span className={styles.type}>{measurement.type}</span>
                </>
            )}
        </div>
    );
};

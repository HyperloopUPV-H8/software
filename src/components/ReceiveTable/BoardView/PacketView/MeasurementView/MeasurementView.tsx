import { RootState } from "store";
import styles from "./MeasurementView.module.scss";
import { Measurement, isNumericMeasurement } from "common";
import { useContext, useLayoutEffect, useRef } from "react";
import { TableContext } from "components/ReceiveTable/TableUpdater";
import { useUpdater } from "./useUpdater";

type Props = {
    boardId: string;
    measurement: Measurement;
};

export const MeasurementView = ({ boardId, measurement }: Props) => {
    const isNumeric = isNumericMeasurement(measurement);

    const { valueRef } = useUpdater(
        boardId,
        measurement.id,
        isNumeric
            ? measurement.value.average.toFixed(3)
            : measurement.value.toString()
    );

    return (
        <>
            <span className={styles.name}>{measurement.name}</span>
            {isNumeric && (
                <>
                    <span
                        ref={valueRef}
                        className={styles.value}
                    ></span>
                    <span className={styles.units}>{measurement.units}</span>
                    <span className={styles.type}>{measurement.type}</span>
                </>
            )}
            {!isNumeric && (
                <>
                    <span
                        ref={valueRef}
                        className={styles.value}
                    ></span>
                    <span className={styles.type}>{measurement.type}</span>
                </>
            )}
        </>
    );
};

import { RootState } from "store";
import styles from "./MeasurementView.module.scss";
import { Measurement, isNumericMeasurement } from "common";
import { useSelector } from "react-redux";
import { memo, useContext, useLayoutEffect, useRef } from "react";
import { TableContext } from "components/ReceiveTableContainer/ImperativeReceiveTable/TableUpdater";

type Props = {
    measurement: Measurement;
};

function measurementSelector(state: RootState, id: string): Measurement {
    return state.measurements[id];
}

export const MeasurementView = ({ measurement }: Props) => {
    const updater = useContext(TableContext);
    const isNumeric = isNumericMeasurement(measurement);

    const valueRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const valueNode = document.createTextNode(
            isNumeric
                ? measurement.value.average.toFixed(3)
                : measurement.value.toString()
        );

        valueRef.current?.appendChild(valueNode);

        updater.addMeasurement(measurement.id, {
            value: valueNode,
        });

        return () => {
            updater.removeMeasurement(measurement.id);

            valueRef.current!.removeChild(valueNode);
        };
    }, []);

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

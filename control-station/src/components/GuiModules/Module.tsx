import React, { useEffect, useState } from "react";
import styles from "./Module.module.scss";
import { useMeasurementsStore } from "common";

interface CellProps {
    value: number;
}

const Module: React.FC<{ id: string }> = ({ id }) => {
    const numericInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo(`module/${id}`)
    );

    const [cellValues, setCellValues] = useState(Array(48).fill(0));

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newValue = numericInfo.getUpdate();
            setCellValues((prev) => prev.map(() => newValue));
        }, 1);

        return () => clearInterval(intervalId);
    }, [numericInfo]);

    const getColorFromValue = (value: number, min: number | null, max: number | null) => {
        if (min !== null && max !== null) {
            if (value < min) return styles.red;
            if (value > max) return styles.red;
            if (value >= min && value <= max) return styles.green;
        }
        return styles.yellow;
    };

    const Cell: React.FC<CellProps> = ({ value }) => {
        const colorClass = getColorFromValue(value, numericInfo.range[0], numericInfo.range[1]);
        return <div className={`${styles.cell} ${colorClass}`}></div>;
    };

    return (
        <div className={styles.boxContainer1}>
            <div className={styles.boxContainer2}>
                <article className={styles.titleDecorationModule}>
                    <h2 className={styles.h2Module}>Module {id}</h2>
                </article>
                <div className={styles.boxContainer3}>
                    <div className={styles.voltajeContainer}>
                        <h3 className={styles.h3}>Voltage</h3>
                        <p className={styles.p}>max: {numericInfo.range[1]} V</p>
                        <p className={styles.p}>min: {numericInfo.range[0]} V</p>
                        <p className={styles.p}>mean: {cellValues.reduce((a, b) => a + b, 0) / cellValues.length}</p>
                    </div>
                    <div className={styles.intensityContainer}>
                        <h3 className={styles.h3}>Intensity</h3>
                        <p className={styles.p}>max: {numericInfo.range[1]} A</p> 
                        <p className={styles.p}>min: {numericInfo.range[0]} A</p>
                    </div>
                </div>
            </div>
            <div className={styles.flexCells}>
                {cellValues.map((value, index) => (
                    <Cell key={index} value={value} />
                ))}
            </div>
        </div>
    );
};

export default Module;

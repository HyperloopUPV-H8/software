import styles from "./ColorfulChart.module.scss";
import { Legend } from "./Legend/Legend";
import { Title } from "./Title/Title";
import { useMemo } from "react";
import { NumericMeasurement } from "../../models";
import { LinesChart } from "../LinesChart/LinesChart";

const palette = ["#EE8735", "#51C6EB", "#7BEE35"];

type Props = {
    className?: string;
    title: string;
    measurements: NumericMeasurement[];
    length: number;
    getMeasurement: (id: string) => NumericMeasurement;
};

export const ColorfulChart = ({
    className = "",
    title,
    measurements,
    length,
    getMeasurement,
}: Props) => {
    const measurementWithPalette = useMemo(
        () =>
            measurements.map((meas, index) => ({
                measurement: meas,
                color: palette[index % palette.length],
            })),
        [measurements]
    );

    return (
        <div className={`${styles.colorfulChart} ${className}`}>
            <Title title={title} />
            <div className={styles.body}>
                <LinesChart
                    height="8rem"
                    divisions={4}
                    grid={false}
                    items={measurementWithPalette}
                    length={length}
                    getMeasurement={getMeasurement}
                />
                <Legend items={measurementWithPalette} />
            </div>
        </div>
    );
};

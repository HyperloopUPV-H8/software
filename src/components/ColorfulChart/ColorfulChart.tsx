import styles from "./ColorfulChart.module.scss";
import { Legend } from "./Legend/Legend";
import { Title } from "./Title/Title";
import { useMemo } from "react";
import { NumericMeasurement } from "common";
import { LinesChart } from "common";
import { store } from "store";

const palette = ["#EE8735", "#51C6EB", "#7BEE35"];

type Props = {
    title: string;
    measurements: NumericMeasurement[];
    length: number;
};

export const ColorfulChart = ({ title, measurements, length }: Props) => {
    const measurementWithPalette = useMemo(
        () =>
            measurements.map((meas, index) => ({
                measurement: meas,
                color: palette[index % palette.length],
            })),
        [measurements]
    );

    return (
        <div className={styles.colorfulChart}>
            <Title title={title} />
            <div className={styles.body}>
                <LinesChart
                    getMeasurement={(id) =>
                        store.getState().measurements[id] as NumericMeasurement
                    }
                    height="8rem"
                    divisions={4}
                    grid={false}
                    items={measurementWithPalette}
                    length={length}
                />
                <Legend items={measurementWithPalette} />
            </div>
        </div>
    );
};

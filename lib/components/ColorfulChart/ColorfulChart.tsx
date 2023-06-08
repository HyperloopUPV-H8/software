import styles from "./ColorfulChart.module.scss";
import { Legend } from "./Legend/Legend";
import { Title } from "./Title/Title";
import { useMemo } from "react";
import { NumericMeasurement } from "../../models";
import { LinesChart } from "../LinesChart/LinesChart";
import { LineDescription } from "../LinesChart/types";
import { nanoid } from "@reduxjs/toolkit";

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
    const chartItems: Array<LineDescription> = useMemo(
        () =>
            measurements.map((meas, index) => ({
                id: nanoid(),
                range: meas.safeRange,
                color: palette[index % palette.length],
                getUpdate: () => getMeasurement(meas.id).value.last,
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
                    showGrid={false}
                    items={chartItems}
                    length={length}
                />
                <Legend items={chartItems} />
            </div>
        </div>
    );
};

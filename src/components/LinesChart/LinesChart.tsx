import styles from "./LineChart.module.scss";
import { ChartTitle } from "./ChartTitle/ChartTitle";
import { ChartItems } from "./ChartItems/ChartItems";
import { Figure } from "components/Figures/Figure/Figure";
import { useEffect, useState, useMemo } from "react";
import { Measurement } from "models/PodData/Measurement";
import { useInterval } from "hooks/useInterval";
import { useChartItems } from "./useChartItems";
import { chartItemToLineData } from "./chartItemToLineData";
import { MultipleLines } from "components/Figures/MultipleLines/MultipleLines";
import { getMinMaxY } from "components/Figures/figures";

function getMinMaxYOfAllLines(dataArr: number[][]) {
    let minY = Infinity;
    let maxY = -Infinity;
    for (let data of dataArr) {
        const [localMinY, localMaxY] = getMinMaxY(data);
        minY = localMinY < minY ? localMinY : minY;
        maxY = localMaxY > maxY ? localMaxY : maxY;
    }

    return [minY, maxY] as const;
}

type Props = {
    title: string;
    measurements: Measurement[];
};

export const LinesChart = ({ title, measurements }: Props) => {
    const [chartItems, updateChartItems] = useChartItems(measurements);

    useInterval(() => {
        updateChartItems();
    }, 1000 / 80);

    const [minY, maxY] = useMemo(() => {
        return getMinMaxYOfAllLines(chartItems.map((item) => item.data));
    }, [chartItems]);
    return (
        <article className={styles.lineChartWrapper}>
            <ChartTitle title={title} />
            <div className={styles.body}>
                <Figure
                    minY={minY}
                    maxY={maxY}
                >
                    <MultipleLines lineDataArr={chartItems} />
                </Figure>
                <ChartItems />
            </div>
        </article>
    );
};

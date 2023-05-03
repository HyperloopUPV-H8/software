import { Measurement } from "models/PodData/Measurement";
import { useMemo, useRef, useState } from "react";
import { ChartItemData } from "./ChartItemData";

const strokeFillPairs = [
    ["#EE8735", "#EE873500"],
    ["#7BEE35", "#7BEE3500"],
    ["#51C6EB", "#51C6EB00"],
] satisfies [string, string][];

function measurementsToChartItems(
    measurements: Measurement[],
    colorArr: [string, string][]
): ChartItemData[] {
    return measurements.map((measurement, index) => {
        return {
            name: measurement.name,
            data: [measurement.value as number],
            strokeColor: colorArr[index % colorArr.length][0],
            fillColor: colorArr[index % colorArr.length][1],
        };
    });
}

export function useChartItems(measurements: Measurement[]) {
    const initialChartItems = useMemo(() => {
        return measurementsToChartItems(measurements, strokeFillPairs);
    }, []);

    const [chartItems, setChartItems] = useState(initialChartItems);

    function updateChartItems() {
        setChartItems((prevItems) => {
            return prevItems.map((item) => {
                const newItem = { ...item };
                const measurement = measurements.find(
                    (measurement) => measurement.name == item.name
                )!;

                newItem.data = [...item.data, measurement.value as number];

                if (newItem.data.length > 100) {
                    newItem.data.shift();
                }
                return newItem;
            });
        });
    }

    return [chartItems, updateChartItems] as const;
}

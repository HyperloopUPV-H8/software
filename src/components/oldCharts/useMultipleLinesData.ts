import { LineDataHandler } from "./LineDataHandler";
import { useMemo, useState } from "react";
import { NumericMeasurement } from "common";
import { useInterval } from "hooks/useInterval";

export function useMultipleLinesData(measurements: NumericMeasurement[]) {
    const DATA_POINTS = 90;

    const lineDataHandlers = useMemo(() => {
        return measurements.map((measurement) => {
            return new LineDataHandler([measurement.value.last], DATA_POINTS);
        });
    }, []);

    const [dataArr, setDataArr] = useState(
        <number[][]>new Array(measurements.length)
    );

    useInterval(() => {
        lineDataHandlers.forEach((handler, index) => {
            handler.updateData(measurements[index].value.last);
        });

        setDataArr(() => {
            return lineDataHandlers.map((handler) => handler.getData());
        });
    }, 1000 / 10);

    const { minY, maxY } = lineDataHandlers[0].getLimits();

    return { dataArr, minY, maxY };
}

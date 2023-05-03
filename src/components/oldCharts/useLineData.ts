import { NumericMeasurement } from "common";
import { LineDataHandler } from "./LineDataHandler";
import { useState, useMemo } from "react";
import { useInterval } from "hooks/useInterval";

export function useLineData(measurement: NumericMeasurement) {
    const DATA_POINTS = 90;
    const lineDataHandler = useMemo(() => {
        return new LineDataHandler([measurement.value.last], DATA_POINTS);
    }, []);

    const [data, setData] = useState(lineDataHandler.getData());

    useInterval(() => {
        lineDataHandler.updateData(measurement.value.last);

        setData(() => {
            return lineDataHandler.getData();
        });
    }, 1000 / 10);

    const { minY, maxY } = lineDataHandler.getLimits();

    return [data, minY, maxY] as const;
}

import { ChartItemData } from "./ChartItemData";
import { LineData } from "components/Figures/LineData";

export function chartItemToLineData(chartItem: ChartItemData): LineData {
    const pairs = dataArrToPairs(chartItem.data);

    return {
        points: pairs,
        strokeColor: chartItem.strokeColor,
        fillColor: chartItem.fillColor,
    };
}

function dataArrToPairs(data: number[]): [number, number][] {
    return data.map((value, index) => [index, value]);
}

import { Measurement } from "common";
import styles from "./CurrentChart.module.scss";
import { Chart } from "components/Chart/ChartWithLegend";
import { LinesChart } from "components/Chart/LinesChart/LinesChart";

type Props = {
    current: Measurement;
    currentRef: Measurement;
};

export const CurrentChart = ({ current, currentRef }: Props) => {
    return (
        <LinesChart
            width="8rem"
            height={"6rem"}
            gridDivisions={3}
            lineDescriptions={[{ id: "airgap_1", color: "#ff0000" }]}
        ></LinesChart>
    );
};

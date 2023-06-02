import { NumericMeasurement } from "common";
import { LinesChart } from "components/LinesChart/LinesChart";

type Props = {
    current: NumericMeasurement;
    currentRef: NumericMeasurement;
};

export const CurrentChart = ({ current, currentRef }: Props) => {
    return (
        <LinesChart
            width="8rem"
            height={"6rem"}
            divisions={3}
            grid
            items={[{ measurement: current, color: "red" }]}
            length={50}
        ></LinesChart>
    );
};

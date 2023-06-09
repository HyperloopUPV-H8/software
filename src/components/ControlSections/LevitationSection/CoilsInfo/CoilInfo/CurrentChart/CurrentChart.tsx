import { NumericMeasurement } from "common";
import { LinesChart } from "common";
import { store } from "store";

type Props = {
    current: NumericMeasurement;
    currentRef: NumericMeasurement;
};

export const CurrentChart = ({ current, currentRef }: Props) => {
    return (
        <LinesChart
            getMeasurement={(id: string) =>
                store.getState().measurements[id] as NumericMeasurement
            }
            width="8rem"
            height={"6rem"}
            divisions={3}
            grid={true}
            items={[{ measurement: current, color: "red" }]}
            length={50}
        ></LinesChart>
    );
};

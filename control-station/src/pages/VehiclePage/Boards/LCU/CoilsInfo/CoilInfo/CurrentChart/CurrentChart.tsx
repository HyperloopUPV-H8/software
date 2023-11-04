import { LinesChart, NumericMeasurement } from "common";
import { store } from "store";

type Props = {
    current: NumericMeasurement;
    currentRef: NumericMeasurement;
};

export const CurrentChart = ({ current }: Props) => {
    return (
        <LinesChart
            width="8rem"
            height={"6rem"}
            divisions={3}
            items={[
                {
                    id: current.id,
                    name: current.name,
                    range: current.safeRange,
                    color: "red",
                    getUpdate: () =>
                        (
                            store.getState().measurements.measurements[
                                current.id
                            ] as NumericMeasurement
                        ).value.last,
                },
            ]}
            length={50}
        ></LinesChart>
    );
};

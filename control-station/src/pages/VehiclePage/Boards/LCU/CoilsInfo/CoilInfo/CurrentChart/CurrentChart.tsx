import { LinesChart, NumericMeasurement, useMeasurementsStore } from "common";

type Props = {
    current: NumericMeasurement;
    currentRef: NumericMeasurement;
};

export const CurrentChart = ({ current }: Props) => {
    const getMeasurement = useMeasurementsStore((state) => state.getMeasurement);

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
                            getMeasurement(current.id) as NumericMeasurement
                        ).value.last,
                },
            ]}
            length={50}
        ></LinesChart>
    );
};

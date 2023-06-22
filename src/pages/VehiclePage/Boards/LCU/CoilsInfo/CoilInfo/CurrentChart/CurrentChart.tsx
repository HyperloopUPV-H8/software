import { NumericMeasurement } from "common";

type Props = {
    current: NumericMeasurement;
    currentRef: NumericMeasurement;
};

export const CurrentChart = ({}: Props) => {
    return (
        <div>Hello Chart</div>
        // <LinesChart

        //     getMeasurement={(id: string) =>
        //         store.getState().measurements[id] as NumericMeasurement
        //     }
        //     width="8rem"
        //     height={"6rem"}
        //     divisions={3}
        //     grid={true}
        //     items={[{ measurement: current, color: "red" }]}
        //     length={50}
        // ></LinesChart>
    );
};

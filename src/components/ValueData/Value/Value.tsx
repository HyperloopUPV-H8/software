import { Measurement, isNumericMeasurement } from "common";

type Props = {
    measurement: Measurement;
};

export const Value = ({ measurement }: Props) => {
    if (isNumericMeasurement(measurement)) {
        return (
            <span>
                {measurement.value.average.toFixed(2)}
                {measurement.units}${}
            </span>
        );
    } else {
        return <span>{measurement.value.toString()}</span>;
    }
};

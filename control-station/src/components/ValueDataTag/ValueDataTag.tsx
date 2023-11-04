import { Measurement, isNumericMeasurement } from "common";
import { StateOverlay } from "components/StateOverlay/StateOverlay";
import { ValueData } from "components/ValueData/ValueData";
import { getState } from "state";

type Props = {
    measurement: Measurement;
};

export const ValueDataTag = (props: Props) => {
    return (
        <StateOverlay state={getState(props.measurement)}>
            <ValueData {...props} />
        </StateOverlay>
    );
};

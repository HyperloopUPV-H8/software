import {
    Measurement,
    clamp,
    clampAndNormalize,
    isNumericMeasurement,
} from "common";

export type State = "stable" | "warning" | "fault";

const FaultLowerBound = 20;
const FaultUpperBound = 80;

const WarningLowerBound = 40;
const WarningUpperBound = 60;

export const stateToColor = {
    stable: "hsl(92, 82%, 56%)",
    warning: "hsl(52, 90%, 61%)",
    fault: "hsl(356, 90%, 61%)",
};

export function getState(meas: Measurement): State {
    if (isNumericMeasurement(meas)) {
        return getStateFromRange(
            meas.value.last,
            meas.safeRange[0],
            meas.safeRange[1]
        );
    } else if (meas.type == "bool") {
        return meas.value ? "stable" : "fault";
    } else {
        return "stable";
    }
}

export function getStateFromRange(
    value: number,
    min: number | null,
    max: number | null
): State {
    if (min !== null && max !== null) {
        const percentage = clampAndNormalize(value, min, max) * 100;

        if (percentage < FaultLowerBound || percentage > FaultUpperBound) {
            return "fault";
        } else if (
            percentage < WarningLowerBound ||
            percentage > WarningUpperBound
        ) {
            return "warning";
        } else {
            return "stable";
        }
    }

    if ((min !== null && value > min) || (max !== null && value < max)) {
        return "stable";
    }

    if (min === null && max === null) {
        return "stable";
    }

    return "fault";
}

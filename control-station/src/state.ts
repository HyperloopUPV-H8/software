import {
    EnumMeasurement,
    Measurement,
    clamp,
    clampAndNormalize,
    isNumericMeasurement,
} from 'common';

export type State = 'stable' | 'warning' | 'fault';

export const stateToColor = {
    stable: '#ACF293',
    warning: '#F4F688',
    fault: '#EF9A87',
};

export const stateToColorBackground = {
    stable: '#E6FFDD',
    warning: '#FCFFDD',
    fault: '#FFE5DD',
};

export function getState(meas: Measurement): State {
    if (isNumericMeasurement(meas)) {
        return getStateFromRange(
            meas.value.last,
            meas.safeRange[0],
            meas.safeRange[1]
        );
    } else if (meas.type == 'bool') {
        return meas.value ? 'stable' : 'fault';
    } else {
        return 'stable';
    }
}

export function getStateFromEnum(_: EnumMeasurement): State {
    return 'stable';
}

export function getStateFromRange(
    value: number,
    safeMin: number | null,
    safeMax: number | null,
    warningMin: number | null,
    warningMax: number | null
): State {
    if (warningMin !== null && value < warningMin) {
        return 'fault';
    }

    if (safeMin !== null && value < safeMin) {
        return 'warning';
    }

    if (warningMax !== null && value > warningMax) {
        return 'fault';
    }

    if (safeMax !== null && value > safeMax) {
        return 'warning';
    }

    return 'stable';
}

export function getPercentageFromRange(
    value: number,
    min: number,
    max: number
): number {
    const normValue = Math.max(Math.min(value, max), min);
    return ((normValue - min) / (max - min)) * 100;
}

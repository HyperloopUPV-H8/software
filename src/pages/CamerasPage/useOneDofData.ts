import { NumericMeasurement } from "common";
import { useMeasurements } from "pages/VehiclePage/useMeasurements";

type OneDofData = {
    y: number;
    rotX: number;
    rotY: number;
    rotZ: number;
};

export function useOneDofData(): OneDofData {
    const measurements = useMeasurements();

    return {
        rotX:
            (
                measurements.measurements[
                    "LCU_MASTER/rot_x"
                ] as NumericMeasurement
            ).value.last ?? 0,
        rotY:
            (
                measurements.measurements[
                    "LCU_MASTER/rot_y"
                ] as NumericMeasurement
            ).value.last ?? 0,
        rotZ:
            (
                measurements.measurements[
                    "LCU_MASTER/rot_z"
                ] as NumericMeasurement
            ).value.last ?? 0,
        y:
            (measurements.measurements["LCU_MASTER/y"] as NumericMeasurement)
                .value.last ?? 0,
    };
}

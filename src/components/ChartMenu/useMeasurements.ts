import { updateMeasurements } from "slices/measurementsSlice";
import { useDispatch } from "react-redux";
import { useBroker } from "common";

export function useMeasurements() {
    const dispatch = useDispatch();

    useBroker("podData/update", (msg) => {
        dispatch(updateMeasurements(msg));
    });
}

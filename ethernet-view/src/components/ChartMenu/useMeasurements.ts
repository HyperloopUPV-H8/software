import { updateMeasurements } from "slices/measurementsSlice";
import { useDispatch } from "react-redux";
import { useSubscribe } from "common";

export function useMeasurements() {
    const dispatch = useDispatch();

    useSubscribe("podData/update", (msg) => {
        dispatch(updateMeasurements(msg));
    });
}

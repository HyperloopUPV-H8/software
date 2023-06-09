import { updateMeasurements } from "slices/measurementsSlice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { store } from "store";
import { useGlobalTicker } from "common";
import { useSubscribe } from "common";

export function useMeasurements() {
    const dispatch = useDispatch();
    const [measurements, setMeasurements] = useState(
        store.getState().measurements
    );

    useSubscribe("podData/update", (msg) => {
        dispatch(updateMeasurements(msg));
    });

    const callback = useCallback(() => {
        setMeasurements(store.getState().measurements);
    }, []);

    useGlobalTicker(callback);

    return measurements;
}

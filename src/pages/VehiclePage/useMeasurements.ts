import { updateMeasurements } from "slices/measurementsSlice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useBroker } from "common";
import { store } from "store";
import { useGlobalTicker } from "hooks/GlobalTicker/useGlobalTicker";

export function useMeasurements() {
    const dispatch = useDispatch();
    const [measurements, setMeasurements] = useState(
        store.getState().measurements
    );

    useBroker("podData/update", (msg) => {
        dispatch(updateMeasurements(msg));
    });

    const callback = useCallback(() => {
        setMeasurements(store.getState().measurements);
    }, []);

    useGlobalTicker(callback);

    return measurements;
}

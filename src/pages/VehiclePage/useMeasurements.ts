import { updateMeasurements } from "slices/measurementsSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useBroker } from "common";
import { useInterval } from "hooks/useInterval";
import { store } from "store";
export function useMeasurements() {
    const dispatch = useDispatch();
    const [measurements, setMeasurements] = useState(
        store.getState().measurements
    );

    useBroker("podData/update", (msg) => {
        dispatch(updateMeasurements(msg));
    });

    useInterval(() => {
        setMeasurements(store.getState().measurements);
    }, 1000 / 15);

    return measurements;
}

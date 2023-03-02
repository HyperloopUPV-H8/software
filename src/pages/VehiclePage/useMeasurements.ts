import { updateMeasurements } from "slices/measurementsSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { useInterval } from "hooks/useInterval";
import { PacketUpdate } from "adapters/PacketUpdate";
import { store } from "store";
export function useMeasurements() {
    const dispatch = useDispatch();
    const [measurements, setMeasurements] = useState(
        store.getState().measurements
    );

    useWebSocketBroker("podData/update", (msg) => {
        dispatch(updateMeasurements(msg as Record<string, PacketUpdate>));
    });

    useInterval(() => {
        setMeasurements(store.getState().measurements);
    }, 1000 / 15);

    return measurements;
}

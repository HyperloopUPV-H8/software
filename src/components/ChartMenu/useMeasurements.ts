import { updateMeasurements } from "slices/measurementsSlice";
import { useDispatch } from "react-redux";
import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";

export function useMeasurements() {
    const dispatch = useDispatch();

    useWebSocketBroker("podData/update", (msg) => {
        dispatch(updateMeasurements(msg));
    });
}

import { updateMeasurements } from "slices/measurementsSlice";
import { useDispatch } from "react-redux";
import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { PacketUpdate } from "adapters/PacketUpdate";

export function useMeasurements() {
    const dispatch = useDispatch();

    useWebSocketBroker("podData/update", (msg) => {
        dispatch(updateMeasurements(msg as Record<string, PacketUpdate>));
    });
}

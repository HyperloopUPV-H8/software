import { useSelector } from "react-redux";
import { RootState } from "store";
import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";

import { useDispatch } from "react-redux";
import { updateBoardConnections } from "slices/connectionsSlice";

export function useConnections() {
    const dispatch = useDispatch();

    useWebSocketBroker("connection/update", (msg) => {
        dispatch(updateBoardConnections(msg));
    });

    return useSelector((state: RootState) => state.connections);
}

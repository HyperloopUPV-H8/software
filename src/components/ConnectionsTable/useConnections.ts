import { useSelector } from "react-redux";
import { RootState } from "store";
import { useBackendWebSocket } from "hooks/useBackendWebSocket";
import { useDispatch } from "react-redux";
import { updateBoardConnectionsArray } from "slices/connectionsSlice";

export function useConnections() {
    const dispatch = useDispatch();

    useBackendWebSocket("connection/update", (msg) => {
        let connections = JSON.parse(msg);
        dispatch(updateBoardConnectionsArray(connections));
    });

    return useSelector((state: RootState) => state.connections);
}

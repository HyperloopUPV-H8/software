import { createConnection } from "models/Connection";
import { store } from "../store";
import {
    setDisconnectionBoardState,
    updateWebsocketConnection,
    updateBoardConnectionsArray,
} from "slices/connectionsSlice";
import { createWebSocketToBackend } from "services/HTTPHandler";

function createConnectionsSocket(): WebSocket {
    let dispatch = store.dispatch;
    let connectionSocket = createWebSocketToBackend(
        import.meta.env.VITE_CONNECTIONS_PATH
    );

    dispatch(updateWebsocketConnection(createConnection("Connections", false)));

    connectionSocket.onopen = () => {
        dispatch(
            updateWebsocketConnection(createConnection("Connections", true))
        );
    };

    connectionSocket.onmessage = (ev) => {
        let connections = JSON.parse(ev.data);
        dispatch(updateBoardConnectionsArray(connections));
    };

    connectionSocket.onclose = () => {
        dispatch(setDisconnectionBoardState());
    };

    return connectionSocket;
}

const connectionService = { createConnectionsSocket };

export default connectionService;

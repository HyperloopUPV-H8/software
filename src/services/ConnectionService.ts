import { store } from "../store";
import { createConnection } from "@models/Connection";
import {
  setDisconnectionBoardState,
  updateWebsocketConnection,
  updateBoardConnectionsArray,
} from "@slices/connectionsSlice";

function createConnectionsSocket(): WebSocket {
  let dispatch = store.dispatch;
  let connectionSocket = new WebSocket(
    `ws://${import.meta.env.VITE_SERVER_IP}:${
      import.meta.env.VITE_SERVER_PORT
    }${import.meta.env.VITE_CONNECTIONS_URL}`
  );
  dispatch(updateWebsocketConnection(createConnection("Connections", false)));

  connectionSocket.onopen = () => {
    dispatch(updateWebsocketConnection(createConnection("Connections", true)));
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

import { useEffect, useRef } from "react";
import { store } from "../store";
import { Connection, createConnection } from "@models/Connection";
import {
  setDisconnectionBoardState,
  updateWebsocketConnection,
  updateBoardConnection,
  updateBoardConnectionsArray,
} from "@slices/connectionsSlice";

function createOrderWebSocket(): WebSocket {
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
    //CHECK this action
    dispatch(updateBoardConnectionsArray(connections));
  };

  connectionSocket.onclose = () => {
    //WATCH OUT: connections must be disconnected after this
    dispatch(setDisconnectionBoardState());
  };

  return connectionSocket;
}

const connectionService = { createOrderWebSocket };

export default connectionService;

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Connection, setConnectionState } from "@models/Connection";
import {
  setDisconnectionState,
  updateConnection,
  updateConnectionsArray,
} from "@slices/connectionsSlice";

export const ConnectionService = ({ children }: any) => {
  const dispatch = useDispatch();
  let connectionSocket = useRef<WebSocket>();
  let connections: Connection[];

  useEffect(() => {
    connectionSocket.current = new WebSocket(
      `ws://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_CONNECTIONS_URL}`
    );

    dispatch(updateConnection(setConnectionState("connections", false)));
    connectionSocket.current.onopen = () => {
      dispatch(updateConnection(setConnectionState("connections", true)));
    };

    connectionSocket.current.onmessage = (ev) => {
      connections = JSON.parse(ev.data);
      //CHECK this action
      dispatch(updateConnectionsArray(connections));
    };

    connectionSocket.current.onclose = () => {
      //WATCH OUT: connections must be disconnected after this
      dispatch(setDisconnectionState());
    };

    return () => {
      if (connectionSocket.current) {
        connectionSocket.current.close();
      }
    };
  }, []);

  return <>{children}</>;
};

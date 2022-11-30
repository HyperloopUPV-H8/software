import { useEffect, createContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { Connection, createConnection } from "@models/Connection";
import { updateConnection } from "@slices/connectionsSlice";

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

    dispatch(updateConnection(createConnection("connections", false)));
    connectionSocket.current.onopen = () => {
      dispatch(updateConnection(createConnection("connections", true)));
    };

    connectionSocket.current.onmessage = (ev) => {
        connections = JSON.parse(ev.data);
        connections.forEach(element => {
            dispatch(updateConnection(element));
        });
    };

    connectionSocket.current.onclose = () => {
      dispatch(updateConnection(createConnection("connections", false)));
      //WATCH OUT: connections must be disconnected after this
      if(connections.length > 0) {
        connections.forEach(element => {
            element.isConnected = false;
            dispatch(updateConnection(element));
        });
      }

    };

    return () => {
      if (connectionSocket.current) {
        connectionSocket.current.close();
      }
    };
  }, []);

  return <>{children}</>;
};
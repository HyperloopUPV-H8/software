import { PacketUpdate } from "@adapters/PacketUpdate";
import { useContext, useEffect, useRef } from "react";

interface IDataService {}

export const DataService = ({ children }: any) => {
  const dataSocket = useRef(
    new WebSocket(
      "ws://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/wsData"
    )
  );

  useEffect(() => {
    dataSocket.current.onopen = () => {};
    dataSocket.current.onmessage = (ev) => {};
    dataSocket.current.onclose;
    dataSocket.current.onerror;

    return () => {
      dataSocket.current.close();
    };
  }, []);
};

import { useEffect, useRef } from "react";
import { initializePodData, updatePodData } from "@slices/podDataSlice";
import { updateConnection } from "@slices/connectionsSlice";
import { PodData } from "@models/PodData/PodData";
import { createConnection } from "@models/Connection";
import axios from "axios";
import { useDispatch } from "react-redux";

async function getPodDataStructure(): Promise<PodData> {
  return axios
    .get(
      `http://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_POD_DATA_DESCRIPTION_URL}`
    )
    .then((response) => {
      return response.data as PodData;
    });
}

export const DataService = ({ children }: any) => {
  const dispatch = useDispatch();
  let packetUpdateSocket!: React.MutableRefObject<WebSocket>;

  useEffect(() => {
    getPodDataStructure()
      .then((podData) => {
        dispatch(initializePodData(podData));
      })
      .then(() => {
        packetUpdateSocket = useRef(
          new WebSocket(
            `ws://${process.env.SERVER_IP}:${process.env.SERVER_PORT}${process.env.ORDERS_DESCRIPTION_URL}`
          )
        );
        packetUpdateSocket.current = new WebSocket(
          `ws://${import.meta.env.VITE_SERVER_IP}:${
            import.meta.env.VITE_SERVER_PORT
          }${import.meta.env.VITE_WS_PACKETS}`
        );
        dispatch(updateConnection(createConnection("Packets", false)));
        packetUpdateSocket.current.onopen = (ev) => {
          dispatch(updateConnection(createConnection("Packets", true)));
        };
        packetUpdateSocket.current.onmessage = (ev) => {
          let packetUpdates = JSON.parse(ev.data);
          dispatch(updatePodData(packetUpdates));
        };
        packetUpdateSocket.current.onclose = () => {
          dispatch(updateConnection(createConnection("Packets", false)));
        };
      });

    return () => {
      packetUpdateSocket.current.close();
    };
  }, []);

  return <>{children}</>;
};

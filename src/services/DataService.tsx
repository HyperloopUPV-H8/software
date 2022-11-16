import { useEffect, useRef } from "react";
import { initializePodData, updatePodData } from "@slices/podDataSlice";
import { PodData } from "@models/PodData/PodData";
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
  const packetUpdateSocket = useRef(
    new WebSocket(
      `ws://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_WS_PACKETS}`
    )
  );

  useEffect(() => {
    getPodDataStructure()
      .then((podData) => {
        dispatch(initializePodData(podData));
      })
      .then(() => {
        packetUpdateSocket.current.onopen = () => {};
        packetUpdateSocket.current.onmessage = (ev) => {
          let packetUpdates = JSON.parse(ev.data);
          dispatch(updatePodData(packetUpdates));
        };

        //TODO: implementar
        //packetUpdateSocket.current.onclose = () => {};
        //packetUpdateSocket.current.onerror = () => {};
      });

    return () => {
      packetUpdateSocket.current.close();
    };
  }, []);

  return <>{children}</>;
};

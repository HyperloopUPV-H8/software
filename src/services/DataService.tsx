import { useEffect, useRef } from "react";
import { initializePodData, updatePodData } from "@slices/podDataSlice";
import { updateConnection } from "@slices/connectionsSlice";
import { PodData } from "@models/PodData/PodData";
import { createConnection } from "@models/Connection";
import axios from "axios";
import { useDispatch } from "react-redux";
import { podDataMock } from "@mocks/PodDataMock";
import { PacketUpdate } from "@adapters/PacketUpdate";

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
  let packetUpdateSocket = useRef<WebSocket>();

  useEffect(() => {
    getPodDataStructure()
      .then((podData) => {
        dispatch(initializePodData(podData));
      })
      .then(() => {
        packetUpdateSocket.current = new WebSocket(
          `ws://${import.meta.env.VITE_SERVER_IP}:${
            import.meta.env.VITE_SERVER_PORT
          }${import.meta.env.VITE_PACKETS_URL}`
        );
        dispatch(updateConnection(createConnection("Packets", false)));
        packetUpdateSocket.current.onopen = (ev) => {
          dispatch(updateConnection(createConnection("Packets", true)));
        };
        packetUpdateSocket.current.onmessage = (ev) => {
          let packetUpdates = JSON.parse(ev.data) as {
            [id: number]: PacketUpdate;
          };
          dispatch(updatePodData(packetUpdates));
        };
        packetUpdateSocket.current.onclose = () => {
          dispatch(updateConnection(createConnection("Packets", false)));
        };
      })
      .catch((reason) => {
        console.error(`Error fetching Data Description: ${reason}`);
      });

    return () => {
      if (packetUpdateSocket.current) {
        packetUpdateSocket.current.close();
      }
    };
  }, []);

  return <>{children}</>;
};

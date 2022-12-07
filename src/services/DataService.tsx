import { useEffect, useRef } from "react";
import { initializePodData, updatePodData } from "@slices/podDataSlice";
import { updateWebsocketConnection } from "@slices/connectionsSlice";
import { PodData } from "@models/PodData/PodData";
import { setConnectionState } from "@models/Connection";
import axios from "axios";
import { useDispatch } from "react-redux";
import { PacketUpdate } from "@adapters/PacketUpdate";

async function fetchPodDataStructure(): Promise<PodData> {
  return fetch(
    `http://${import.meta.env.VITE_SERVER_IP}:${
      import.meta.env.VITE_SERVER_PORT
    }${import.meta.env.VITE_POD_DATA_DESCRIPTION_URL}`
  )
    .catch((reason: any) => {
      console.error("Error fetching PodDataDescription", reason);
    })
    .then((response) => {
      return response!.json();
    })
    .catch((reason) => {
      console.error("Error converting podDataDescription to JSON", reason);
    })
    .then((podData) => {
      podData;
      return podData as PodData;
    });
}

export const DataService = ({ children }: any) => {
  const dispatch = useDispatch();
  const packetUpdateSocket = useRef<WebSocket>();

  useEffect(() => {
    initPodData();
    createPacketWebSocket();
    return () => {
      if (packetUpdateSocket.current) {
        packetUpdateSocket.current.close();
      }
    };
  }, []);

  async function initPodData(): Promise<void> {
    return fetchPodDataStructure().then((podData) => {
      dispatch(initializePodData(podData));
    });
  }

  function createPacketWebSocket() {
    packetUpdateSocket.current = new WebSocket(
      `ws://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_PACKETS_URL}`
    );

    dispatch(updateWebsocketConnection(setConnectionState("Packets", false)));

    packetUpdateSocket.current.onopen = (ev) => {
      dispatch(updateWebsocketConnection(setConnectionState("Packets", true)));
    };

    packetUpdateSocket.current.onmessage = (ev) => {
      let packetUpdates = JSON.parse(ev.data) as {
        [id: number]: PacketUpdate;
      };
      dispatch(updatePodData(packetUpdates));
    };

    packetUpdateSocket.current.onerror = () => {
      console.error("Error in Packet WebSocket");
    };

    packetUpdateSocket.current.onclose = () => {
      dispatch(updateWebsocketConnection(setConnectionState("Packets", false)));
    };
  }

  return <>{children}</>;
};

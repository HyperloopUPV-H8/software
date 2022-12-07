import { Connection } from "@models/Connection";
import { useEffect, useRef } from "react";
import { initializePodData, updatePodData } from "@slices/podDataSlice";
import { updateConnection } from "@slices/connectionsSlice";
import { PodData } from "@models/PodData/PodData";
import { createConnection } from "@models/Connection";
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

function createPacketWebSocket(
  onMessage: (ev: MessageEvent) => void,
  updateConnectionState: (conn: Connection) => void
): WebSocket {
  let packetUpdateSocket = new WebSocket(
    `ws://${import.meta.env.VITE_SERVER_IP}:${
      import.meta.env.VITE_SERVER_PORT
    }${import.meta.env.VITE_PACKETS_URL}`
  );

  updateConnectionState(createConnection("Packets", false));

  packetUpdateSocket.onopen = (ev) => {
    updateConnectionState(createConnection("Packets", true));
  };
  packetUpdateSocket.onmessage = onMessage;

  packetUpdateSocket.onerror = () => {
    console.error("Error in Packet WebSocket");
  };

  packetUpdateSocket.onclose = () => {
    updateConnectionState(createConnection("Packets", false));
  };

  return packetUpdateSocket;
}

const dataService = {
  fetchPodDataStructure,
  createPacketWebSocket,
};

export default dataService;

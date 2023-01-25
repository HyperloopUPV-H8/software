import { Connection } from "models/Connection";
import { useEffect, useRef } from "react";
import { initializePodData, updatePodData } from "slices/podDataSlice";
import { updateWebsocketConnection } from "slices/connectionsSlice";
import { PodData } from "models/PodData/PodData";
import { createConnection } from "models/Connection";
import { PacketUpdate } from "adapters/PacketUpdate";
import { store } from "../store";
import {
    fetchFromBackend,
    createWebSocketToBackend,
} from "services/HTTPHandler";

async function fetchPodDataStructure(): Promise<PodData> {
    return fetchFromBackend(import.meta.env.VITE_POD_DATA_DESCRIPTION_PATH)
        .catch((reason: any) => {
            console.error("Error fetching PodDataDescription", reason);
        })
        .then((response) => {
            return response!.json();
        })
        .catch((reason) => {
            console.error(
                "Error converting podDataDescription to JSON",
                reason
            );
        })
        .then((podData) => {
            podData;
            return podData as PodData;
        });
}

function createPacketWebSocket(): WebSocket {
    let dispatch = store.dispatch;
    let packetUpdateSocket = createWebSocketToBackend(
        import.meta.env.VITE_PACKETS_PATH
    );

    dispatch(updateWebsocketConnection(createConnection("Packets", false)));

    packetUpdateSocket.onopen = (ev) => {
        dispatch(updateWebsocketConnection(createConnection("Packets", true)));
    };

    packetUpdateSocket.onmessage = (ev) => {
        let packetUpdates = JSON.parse(ev.data) as {
            [id: number]: PacketUpdate;
        };
        dispatch(updatePodData(packetUpdates));
    };

    packetUpdateSocket.onerror = () => {
        console.error("Error in Packet WebSocket");
    };

    packetUpdateSocket.onclose = () => {
        dispatch(updateWebsocketConnection(createConnection("Packets", false)));
    };

    return packetUpdateSocket;
}

const dataService = {
    fetchPodDataStructure,
    createPacketWebSocket,
};

export default dataService;

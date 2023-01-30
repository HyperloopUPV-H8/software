import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { initializePodData } from "slices/podDataSlice";
import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { updatePodData } from "slices/podDataSlice";
import { PacketUpdate } from "adapters/PacketUpdate";
import { fetchFromBackend } from "services/HTTPHandler";
import { PodData } from "models/PodData/PodData";

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

export function usePodData() {
    const dispatch = useDispatch();

    const isPodDataReady = useRef(false);

    useWebSocketBroker("podData/update", (msg) => {
        if (isPodDataReady.current) {
            let packetUpdates = msg as {
                [id: number]: PacketUpdate;
            };
            dispatch(updatePodData(packetUpdates));
        }
    });

    useEffect(() => {
        fetchPodDataStructure().then((podData) => {
            dispatch(initializePodData(podData));
            isPodDataReady.current = true;
        });
    }, [fetchPodDataStructure, dispatch, initializePodData]);
}

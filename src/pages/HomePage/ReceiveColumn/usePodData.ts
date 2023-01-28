import { useEffect } from "react";
import dataService from "services/DataService";
import { useDispatch } from "react-redux";
import { initializePodData } from "slices/podDataSlice";
import { useBackendWebSocket } from "hooks/useBackendWebSocket";
import { updatePodData } from "slices/podDataSlice";
import { PacketUpdate } from "adapters/PacketUpdate";

export function usePodData() {
    const dispatch = useDispatch();

    useBackendWebSocket("data/update", (msg) => {
        let packetUpdates = JSON.parse(msg) as {
            [id: number]: PacketUpdate;
        };
        dispatch(updatePodData(packetUpdates));
    });

    useEffect(() => {
        dataService.fetchPodDataStructure().then((podData) => {
            dispatch(initializePodData(podData));
        });
    }, []);
}

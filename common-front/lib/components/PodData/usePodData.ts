import { PacketUpdate, useSubscribe } from "../..";
import { usePodDataStore } from "../../store/podDataStore";
import { useMeasurementsStore } from "../../store/measurementsStore";

export function usePodData() {
    const updatePodData = usePodDataStore((state) => state.updatePodData);
    const updateMeasurements = useMeasurementsStore((state) => state.updateMeasurements);

    useSubscribe("podData/update", (updates: Record<string, PacketUpdate>) => {
        updatePodData(updates);
        updateMeasurements(updates);
    });
}
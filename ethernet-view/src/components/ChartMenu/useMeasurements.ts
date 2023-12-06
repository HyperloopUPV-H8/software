import { useMeasurementsStore } from "common";
import { useSubscribe } from "common";

export function useMeasurements() {
    const updateMeasurements = useMeasurementsStore((state) => state.updateMeasurements);

    useSubscribe("podData/update", (msg) => {
        updateMeasurements(msg);
    });
}

import { store } from "store";
import { fetchFromBackend } from "services/HTTPHandler";
import { initMeasurements } from "slices/measurementsSlice";

export const loadPodData = async () => {
    const state = store.getState();
    if (Object.keys(state.measurements).length == 0) {
        const response = await fetchFromBackend(
            import.meta.env.VITE_POD_DATA_DESCRIPTION_PATH
        );
        const podData = await response.json();
        store.dispatch(initMeasurements(podData));
    }
    return null;
};

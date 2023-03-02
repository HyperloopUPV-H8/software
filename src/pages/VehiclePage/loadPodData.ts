import { store } from "store";
import { LoaderFunctionArgs } from "react-router-dom";
import { fetchFromBackend } from "services/HTTPHandler";
import { initMeasurements } from "slices/measurementsSlice";

export const loadPodData = async (args: LoaderFunctionArgs) => {
    const state = store.getState();
    if (Object.keys(state.measurements).length == 0) {
        const response = await fetchFromBackend(
            import.meta.env.VITE_POD_DATA_DESCRIPTION_URL
        );
        const podData = await response.json();
        store.dispatch(initMeasurements(podData));
    }
    return null;
};

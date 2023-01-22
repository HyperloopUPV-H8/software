import { ControlDataNameMap } from "components/ControlSections/types/ControlData";
import { fetchFromBackend } from "services/HTTPHandler";
import { setControlSections } from "slices/controlSectionsSlice";
import { store } from "store";

export async function fetchControlSections(): Promise<ControlDataNameMap> {
    const response = await fetchFromBackend(
        import.meta.env.VITE_CONTROL_SECTIONS_PATH
    );
    const controlSections = await response.json();
    store.dispatch(setControlSections(controlSections));
    return controlSections as ControlDataNameMap;
}

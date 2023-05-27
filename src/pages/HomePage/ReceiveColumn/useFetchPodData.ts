import { useDispatch } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { fetchFromBackend } from "services/fetch";
import { initPodData } from "slices/podDataSlice";
import { initMeasurements } from "slices/measurementsSlice";

export enum RequestState {
    PENDING,
    FULFILLED,
    REJECTED,
}

export function useFetchPodData() {
    const [requestState, setRequestState] = useState(RequestState.PENDING);
    const dispatch = useDispatch();

    useEffect(() => {
        const controller = new AbortController();

        fetchFromBackend(
            import.meta.env.VITE_POD_DATA_DESCRIPTION_PATH,
            controller.signal
        )
            .then((res) => {
                return res!.json();
            })
            .then((podData) => {
                dispatch(initPodData(podData));
                dispatch(initMeasurements(podData));
                setRequestState(RequestState.FULFILLED);
            })
            .catch((err) => {
                setRequestState(RequestState.REJECTED);
                //TODO: dont notify AbortError
                console.error("Error fetching podData", err);
            });

        return () => {
            controller.abort();
        };
    }, []);

    return requestState;
}

import { useDispatch } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { fetchFromBackend } from "services/fetch";
import { initPodData, updatePodData } from "slices/podDataSlice";
import { useBroker } from "common";
import { initMeasurements, updateMeasurements } from "slices/measurementsSlice";

export enum RequestState {
    PENDING,
    FULFILLED,
    REJECTED,
}

export function useFetchPodData() {
    const [requestState, setRequestState] = useState(RequestState.PENDING);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchFromBackend(import.meta.env.VITE_POD_DATA_DESCRIPTION_PATH)
            .catch((reason: any) => {
                setRequestState(RequestState.REJECTED);
                console.error("Error fetching PodDataDescription", reason);
            })
            .then((response) => {
                return response!.json();
            })
            .catch((reason) => {
                setRequestState(RequestState.REJECTED);
                console.error(
                    "Error converting podDataDescription to JSON",
                    reason
                );
            })
            .then((podData) => {
                dispatch(initPodData(podData));
                dispatch(initMeasurements(podData));
                setRequestState(RequestState.FULFILLED);
            });
    }, []);

    useBroker("podData/update", (msg) => {
        if (requestState == RequestState.FULFILLED) {
            dispatch(updatePodData(msg));
            dispatch(updateMeasurements(msg));
        }
    });

    return requestState;
}

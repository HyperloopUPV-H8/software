import { useEffect, useState } from "react";
import { WsHandler, createWsHandler, fetchBack, useConfig, useConnectionsStore, useFetchBack, useMeasurementsStore, usePodDataStore } from ".." 

type loadBackendResult = {
    state: "pending";
} | {
    state: "fulfilled";
    wsHandler: WsHandler;
} | {
    state: "rejected";
    error: Error;
};

type UseLoadBackend = (isProduction: boolean) => loadBackendResult;

// Custom hook that initializes the Websocket connection, returning the WsHandler object
// and fetches the podDataDescription from the server, initializing the PodData and Measurements in the store.
export const useLoadBackend : UseLoadBackend = (isProduction) => {
    const config = useConfig();
    const initPodData = usePodDataStore((state) => state.initPodData);
    const initMeasurements = useMeasurementsStore((state) => state.initMeasurements);
    const setBackendConnection = useConnectionsStore((state) => state.setBackendConnection);
    
    const [result, setResult] = useState<loadBackendResult>({state: "pending"});

    const BACKEND_URL = isProduction
        ? `${config.prodServer.ip}:${config.prodServer.port}/${config.paths.websocket}`
        : `${config.devServer.ip}:${config.devServer.port}/${config.paths.websocket}`;

    const POD_DATA_DESCRIPTION_URL = isProduction
        ? `${config.prodServer.ip}:${config.prodServer.port}/${config.paths.podDataDescription}`
        : `${config.devServer.ip}:${config.devServer.port}/${config.paths.podDataDescription}`;

    useEffect(() => {
        Promise.all([
            createWsHandler(
                BACKEND_URL,
                true,
                () => setBackendConnection(true),
                () => setBackendConnection(false)
            ),
            fetch(POD_DATA_DESCRIPTION_URL).then((res) => res.json()).then(
                (adapter) => {
                    initPodData(adapter);
                    initMeasurements(adapter);
                }
            ),
        ])
        .then(result => setResult({state: "fulfilled", wsHandler: result[0]}))
        .catch(error => setResult({state: "rejected", error}));
    }, []);

    return result;
}

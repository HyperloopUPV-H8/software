import { useConnectionsStore, useMeasurementsStore, usePodDataStore, useSubscribe } from "../../";

export function useConnections() {

    const setBoardConnections = useConnectionsStore(state => state.setConnections)
    const clearMeasurements = useMeasurementsStore(state => state.clearMeasurements)
    const clearPodData = usePodDataStore(state => state.clearPodData);
    const connections = useConnectionsStore(state => state.connections)

    useSubscribe("connection/update", (update) => {
        setBoardConnections(update)
        for (const connection of Object.values(update)) {
            if (connection.isConnected) {
                clearMeasurements(connection.name)
                clearPodData(connection.name)
            }
        }
    });

    return connections;
}

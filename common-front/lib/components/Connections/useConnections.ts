import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useConnectionsStore, useSubscribe } from "../..";

export function useConnections() {

    // const setBoardConnections = useStore(state => state.setConnections);
    // const connections = useStore(state => state.connections);

    const setBoardConnections = useConnectionsStore(state => state.setConnections);
    const connections = useConnectionsStore(state => state.connections)

    useSubscribe("connection/update", (update) => {
        setBoardConnections(update)
    });

    return connections;
}

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSubscribe } from "../..";
import { connectionsSlice } from "../../slices/connectionsSlice";

export function useConnections() {
    const dispatch = useDispatch();

    useSubscribe("connection/update", (update) => {
        dispatch(connectionsSlice.actions.updateBoardConnections(update));
    });

    return useSelector(
        (state: {
            connections: ReturnType<typeof connectionsSlice.getInitialState>;
        }) => state.connections
    );
}

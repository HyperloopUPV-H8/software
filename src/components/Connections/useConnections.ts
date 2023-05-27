import { useSelector } from "react-redux";
import { RootState } from "store";
import { useSubscribe } from "common";
import { useDispatch } from "react-redux";
import { updateBoardConnections } from "slices/connectionsSlice";

export function useConnections() {
    const dispatch = useDispatch();

    useSubscribe("connection/update", (update) => {
        dispatch(updateBoardConnections(update));
    });

    return useSelector((state: RootState) => state.connections);
}

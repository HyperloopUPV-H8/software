import { useSelector } from "react-redux";
import { RootState } from "store";
import { useBroker } from "common";
import { useDispatch } from "react-redux";
import { updateBoardConnections } from "slices/connectionsSlice";
import { useEffect } from "react";

export function useConnections() {
    const dispatch = useDispatch();

    const sender = useBroker("connection/update", (msg) => {
        dispatch(updateBoardConnections(msg));
    });

    useEffect(() => {
        sender(null);
    }, []);

    return useSelector((state: RootState) => state.connections);
}

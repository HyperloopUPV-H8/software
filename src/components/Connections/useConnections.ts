import { useSelector } from "react-redux";
import { RootState } from "store";
import { useSubscribe, useWsHandler } from "common";
import { useDispatch } from "react-redux";
import { updateBoardConnections } from "slices/connectionsSlice";
import { useEffect } from "react";

export function useConnections() {
    const dispatch = useDispatch();

    useSubscribe("connection/update", (msg) => {
        dispatch(updateBoardConnections(msg));
    });

    return useSelector((state: RootState) => state.connections);
}

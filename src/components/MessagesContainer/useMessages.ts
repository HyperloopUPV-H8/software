import { MessageAdapter, useBroker, useSubscribe } from "common";
import { addMessage } from "slices/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useCallback } from "react";

export function useMessages() {
    const dispatch = useDispatch();

    const handleMessage = useCallback((msg: MessageAdapter) => {
        dispatch(addMessage(msg));
    }, []);

    useSubscribe("message/update", handleMessage);

    return useSelector((state: RootState) => state.messages);
}

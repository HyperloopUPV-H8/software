import { useBroker } from "common";
import { addMessage } from "slices/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";

export function useMessages() {
    const dispatch = useDispatch();

    useBroker("message/update", (msg) => {
        dispatch(addMessage(msg));
    });

    return useSelector((state: RootState) => state.messages);
}

import { messageSlice } from "../../slices/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { Message, MessageAdapter, useSubscribe } from "../..";

export function useMessages() {
    const dispatch = useDispatch();

    useSubscribe("message/update", (msg: MessageAdapter) => {
        dispatch(messageSlice.actions.addMessage(msg));
    });

    return useSelector((state: { messages: Message[] }) => state.messages);
}

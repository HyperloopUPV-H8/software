import { MessageAdapter, useSubscribe } from "../..";
import { useMessagesStore } from "../..";

export function useMessages() {
    
    const addMessage = useMessagesStore((state) => state.addMessage);
    const messages = useMessagesStore((state) => state.messages);

    useSubscribe("message/update", (msg: MessageAdapter) => {
        addMessage(msg);
    });

    return messages;
}

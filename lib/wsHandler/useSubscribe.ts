import { useEffect } from "react";
import { HandlerMessages } from "./HandlerMessages";
import { SubscriptionTopic } from "./types";
import { useWsHandler } from ".";

export function useSubscribe<T extends SubscriptionTopic>(
    topic: T,
    cb: (v: HandlerMessages[T]["response"]) => void
) {
    const handler = useWsHandler();

    useEffect(() => {
        handler.subscribe(topic, cb);

        return () => {
            handler.unsubscribe(topic, cb);
        };
    }, [topic]);
}

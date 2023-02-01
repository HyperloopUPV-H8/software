import { WebSocketBrokerContext } from "./WebSocketBrokerContext";
import { useContext, useEffect, useCallback } from "react";

export function useWebSocketBroker(
    topic: string,
    callback?: (msg: any) => void
): (msg: any) => void {
    const webSocketBroker = useContext(WebSocketBrokerContext)!;

    useEffect(() => {
        if (callback) {
            webSocketBroker.addCallback(topic, callback);
        }

        return () => {
            if (callback) {
                webSocketBroker.removeCallback(topic, callback);
            }
        };
    }, [topic, callback, webSocketBroker]);

    const sender = useCallback(() => {
        return webSocketBroker.createSender(topic).bind(webSocketBroker);
    }, [webSocketBroker]);

    return sender;
}

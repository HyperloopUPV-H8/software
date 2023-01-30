import { WebSocketBrokerContext } from "./WebSocketBrokerContext";
import { useContext, useEffect, useCallback } from "react";

export function useWebSocketBroker(
    type: string,
    callback?: (msg: any) => void
): (msg: any) => void {
    const webSocketBroker = useContext(WebSocketBrokerContext)!;

    useEffect(() => {
        if (callback) {
            webSocketBroker.addCallback(type, callback);
        }

        return () => {
            if (callback) {
                webSocketBroker.removeCallback(type, callback);
            }
        };
    }, [type, callback, webSocketBroker]);

    const sender = useCallback(() => {
        return webSocketBroker.createSender(type).bind(webSocketBroker);
    }, [webSocketBroker]);

    return sender;
}

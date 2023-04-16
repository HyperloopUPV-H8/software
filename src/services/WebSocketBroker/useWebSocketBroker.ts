import { MessageTypes, Request, Response } from "./MessageTypes";
import { WebSocketBrokerContext } from "./WebSocketBrokerContext";
import { useContext, useEffect, useCallback } from "react";

export function useWebSocketBroker<Topic extends keyof MessageTypes>(
    topic: Topic,
    callback?: (msg: Response<Topic>) => void
): (msg: Request<Topic>) => void {
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

    const sender = useCallback(
        webSocketBroker.createSender(topic).bind(webSocketBroker),
        [webSocketBroker]
    );

    return sender;
}

import { BrokerStructure } from "./BrokerStructure";
import { Request, Response } from "./types";
import { BrokerContext } from "./BrokerContext";
import { useContext, useEffect, useCallback } from "react";

export function useBroker<Topic extends keyof BrokerStructure>(
    topic: Topic,
    callback?: (msg: Response<Topic>) => void
): (msg: Request<Topic>) => void {
    const webSocketBroker = useContext(BrokerContext);

    useEffect(() => {
        if (callback) {
            webSocketBroker?.addCallback(topic, callback);
        }

        return () => {
            if (callback) {
                webSocketBroker?.removeCallback(topic, callback);
            }
        };
    }, [topic, callback, webSocketBroker]);

    const sender = useCallback(
        webSocketBroker ? webSocketBroker.createSender(topic) : () => {},
        [webSocketBroker]
    );

    return sender;
}

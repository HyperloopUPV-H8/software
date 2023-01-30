import React, { createContext, useEffect, useRef } from "react";
import { WebSocketBroker } from "./WebSocketBroker";

export const WebSocketBrokerContext = createContext<WebSocketBroker | null>(
    null
);

type Props = { url: string; children: React.ReactNode };

export const WebSocketBrokerProvider = ({ url, children }: Props) => {
    const webSocketBroker = useRef<WebSocketBroker | null>(null);

    webSocketBroker.current ??= new WebSocketBroker(url);

    useEffect(() => {
        return () => {
            webSocketBroker.current?.close();
        };
    }, [webSocketBroker.current]);

    return (
        <WebSocketBrokerContext.Provider value={webSocketBroker.current}>
            {children}
        </WebSocketBrokerContext.Provider>
    );
};

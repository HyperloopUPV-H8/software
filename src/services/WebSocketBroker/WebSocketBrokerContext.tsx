import React, { createContext, useEffect, useRef } from "react";
import { WebSocketBroker } from "./WebSocketBroker";

export const WebSocketBrokerContext = createContext<WebSocketBroker | null>(
    null
);

type Props = {
    url: string;
    onOpen: () => void;
    onClose: () => void;
    children: React.ReactNode;
};

export const WebSocketBrokerProvider = ({
    url,
    onOpen,
    onClose,
    children,
}: Props) => {
    const webSocketBroker = useRef<WebSocketBroker | null>(null);

    webSocketBroker.current ??= new WebSocketBroker(url, onOpen, onClose);

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

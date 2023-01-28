import React, { createContext, useEffect, useRef } from "react";

type Callback = (msg: any) => void;

type BackendMessage<T = any> = {
    path: string;
    msg: T;
};
class WebSocketHandler {
    public webSocket: WebSocket;
    private pathToCallbacks: Map<string, Array<Callback>> = new Map();

    constructor(url: string) {
        this.webSocket = new WebSocket(`ws://${url}`);
        this.webSocket.onopen = () => {
            console.log("Opened backend websocket");
        };

        this.webSocket.onmessage = (ev: MessageEvent<BackendMessage>) => {
            const callbacks = this.pathToCallbacks.get(ev.data.path) ?? [];

            for (const callback of callbacks) {
                callback(ev.data.msg);
            }
        };

        this.webSocket.onclose = () => {
            console.log("Closed backend websocket");
        };
    }

    public addCallback(path: string, handler: Callback) {
        const handlers = this.pathToCallbacks.get(path) ?? [];
        this.pathToCallbacks.set(path, [...handlers, handler]);
    }

    public removeCallback(path: string, handler: Callback) {
        if (!this.pathToCallbacks.has(path)) {
            console.warn(`Path ${path} doesn't exist in pathToHandlers`);
        } else {
            const handlers = this.pathToCallbacks.get(path)!;
            this.pathToCallbacks.set(
                path,
                handlers.filter((element) => element != handler)
            );
        }
    }

    public createSender(type: string) {
        return (msg: any) => {
            this.webSocket.send(JSON.stringify({ type, msg }));
        };
    }

    public close() {
        this.webSocket.close();
    }
}

export const WebSocketHandlerContext = createContext<WebSocketHandler | null>(
    null
);

type Props = { children: React.ReactNode };
export const BackendWebSocketContext = ({ children }: Props) => {
    const webSocketHandler = useRef(
        new WebSocketHandler(
            `${import.meta.env.VITE_SERVER_IP}:${
                import.meta.env.VITE_SERVER_PORT
            }${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`
        )
    );

    useEffect(() => {
        return () => {
            webSocketHandler.current.close();
        };
    }, []);

    return (
        <WebSocketHandlerContext.Provider value={webSocketHandler.current}>
            {children}
        </WebSocketHandlerContext.Provider>
    );
};

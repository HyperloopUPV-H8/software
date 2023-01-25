import { createContext } from "react";

type Handler = (msg: any) => void;
type BackendMessage<T = any> = {
    path: string;
    msg: T;
};
export class WebSocketHandler {
    public webSocket: WebSocket;
    private pathToHandlers: Map<string, Array<Handler>> = new Map();

    constructor(url: string) {
        console.log("NEW WEB SOCKET HANDLER");
        this.webSocket = new WebSocket(`ws://${url}`);

        this.webSocket.onopen = () => {
            console.log("Opened backend websocket");
        };

        this.webSocket.onmessage = (ev: MessageEvent<BackendMessage>) => {
            const handlers = this.pathToHandlers.get(ev.data.path) ?? [];

            for (const handler of handlers) {
                handler(ev.data.msg);
            }
        };
    }

    public addHandler(path: string, handler: Handler) {
        const handlers = this.pathToHandlers.get(path) ?? [];
        this.pathToHandlers.set(path, [...handlers, handler]);
    }

    public removeHandler(path: string, handler: Handler) {
        if (!this.pathToHandlers.has(path)) {
            console.warn(`Path ${path} doesn't exist in pathToHandlers`);
        } else {
            const handlers = this.pathToHandlers.get(path)!;
            this.pathToHandlers.set(
                path,
                handlers.filter((element) => element != handler)
            );
        }
    }
}

export const WebSocketHandlerContext = createContext<WebSocketHandler | null>(
    null
);

export function createWebSocketToBackend() {
    return new WebSocket(
        `ws://${import.meta.env.VITE_SERVER_IP}:${
            import.meta.env.VITE_SERVER_PORT
        }`
    );
}

import { createContext } from "react";
import { useContext, useEffect } from "react";
import { updatePodData } from "slices/podDataSlice";
import { PacketUpdate } from "adapters/PacketUpdate";
import { store } from "../store";

type Callback = (msg: any) => void;
type BackendMessage<T = any> = {
    path: string;
    msg: T;
};
export class WebSocketHandler {
    public webSocket: WebSocket;
    private pathToCallbacks: Map<string, Array<Callback>> = new Map();

    constructor(url: string) {
        console.log("NEW WEB SOCKET HANDLER");
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
}

export const WebSocketHandlerContext = createContext<WebSocketHandler | null>(
    null
);

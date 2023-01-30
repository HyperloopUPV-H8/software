import { Callback, BackendMessage } from "./types";

export class WebSocketBroker {
    private webSocket: WebSocket;
    private topicToCallbacks: Map<string, Array<Callback>> = new Map();

    constructor(url: string, onOpen: () => void, onClose: () => void) {
        this.webSocket = new WebSocket(`ws://${url}`);
        this.webSocket.onopen = onOpen;

        this.webSocket.onmessage = (ev: MessageEvent<string>) => {
            const socketMessage = JSON.parse(ev.data) as BackendMessage;
            const callbacks =
                this.topicToCallbacks.get(socketMessage.topic) ?? [];
            for (const callback of callbacks) {
                callback(socketMessage.msg);
            }
        };

        this.webSocket.onclose = onClose;
    }

    public addCallback(topic: string, callback: Callback) {
        const callbacks = this.topicToCallbacks.get(topic) ?? [];
        this.topicToCallbacks.set(topic, [...callbacks, callback]);
    }

    public removeCallback(topic: string, handler: Callback) {
        if (!this.topicToCallbacks.has(topic)) {
            console.warn(`Path ${topic} doesn't exist in pathToHandlers`);
        } else {
            const callbacks = this.topicToCallbacks.get(topic)!;
            this.topicToCallbacks.set(
                topic,
                callbacks.filter((element) => element != handler)
            );

            if (this.topicToCallbacks.get(topic)?.length == 0) {
                this.topicToCallbacks.delete(topic);
            }
        }
    }

    public createSender(topic: string) {
        return (msg: any) => {
            this.webSocket.send(
                JSON.stringify({ topic, msg } as BackendMessage)
            );
        };
    }

    public close() {
        if (this.webSocket.readyState == this.webSocket.OPEN) {
            this.webSocket.close();
        }
    }
}

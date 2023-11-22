import { BrokerStructure } from "./BrokerStructure";
import { BackendMessage, Callback, Request, Topic } from "./types";

export class Broker {
    private webSocket!: WebSocket;
    private typeToCallbacks: Map<string, Callback<Topic>[]> = new Map();

    constructor(url: string, onOpen?: () => void, onClose?: () => void) {
        this.webSocket = new WebSocket(`ws://${url}`);

        if (onOpen) {
            this.webSocket.onopen = onOpen;
        }

        this.webSocket.onmessage = (ev: MessageEvent<string>) => {
            const socketMessage = JSON.parse(ev.data) as BackendMessage;
            const callbacks =
                this.typeToCallbacks.get(socketMessage.topic) ?? [];
            for (const callback of callbacks) {
                callback(socketMessage.msg);
            }
        };

        if (onClose) {
            this.webSocket.onclose = onClose;
        }
    }

    public addCallback(type: string, callback: Callback<Topic>) {
        const callbacks = this.typeToCallbacks.get(type) ?? [];
        this.typeToCallbacks.set(type, [...callbacks, callback]);
    }

    public removeCallback(type: string, handler: Callback<Topic>) {
        if (!this.typeToCallbacks.has(type)) {
            console.warn(`Path ${type} doesn't exist in pathToHandlers`);
        } else {
            const callbacks = this.typeToCallbacks.get(type)!;
            this.typeToCallbacks.set(
                type,
                callbacks.filter((element) => element != handler)
            );

            if (this.typeToCallbacks.get(type)?.length == 0) {
                this.typeToCallbacks.delete(type);
            }
        }
    }

    public createSender<Topic extends keyof BrokerStructure>(topic: Topic) {
        return (msg: Request<Topic>) => {
            this.webSocket.send(JSON.stringify({ topic, msg }));
        };
    }

    public close() {
        this.webSocket.close();
    }
}

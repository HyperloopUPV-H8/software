import { HandlerMessages } from "./HandlerMessages";
import {
    ExchangeTopic,
    PostTopic,
    SubscriptionTopic,
    WsMessage,
} from "./types";

export class WsHandler {
    private ws: WebSocket;
    private topicToCallbacks: Map<string, Array<(value: any) => void>> =
        new Map();

    constructor(url: string, onOpen?: () => void, onClose?: () => void) {
        this.ws = new WebSocket(`ws://${url}`);

        if (onOpen) {
            this.ws.onopen = onOpen;
        }

        this.ws.onmessage = (ev: MessageEvent<string>) => {
            const socketMessage = JSON.parse(ev.data) as WsMessage;
            const callbacks =
                this.topicToCallbacks.get(socketMessage.topic) ?? [];
            for (const callback of callbacks) {
                callback(socketMessage.payload);
            }
        };

        if (onClose) {
            this.ws.onclose = onClose;
        }
    }

    public post<T extends PostTopic>(
        topic: T,
        payload: HandlerMessages[T]["request"]
    ) {
        //TODO: in the back is called msg instead of payload!
        this.ws.send(JSON.stringify({ topic, payload }));
    }

    public subscribe<T extends SubscriptionTopic>(
        topic: T,
        callback: (value: HandlerMessages[T]["response"]) => void
    ) {
        const callbacks = this.topicToCallbacks.get(topic);
        if (callbacks) {
            this.topicToCallbacks.set(topic, [...callbacks, callback]);
        } else {
            this.topicToCallbacks.set(topic, [callback]);
        }

        this.ws.send(JSON.stringify({ topic, payload: true }));
    }

    public unsubscribe<T extends SubscriptionTopic>(
        topic: T,
        callback: (value: HandlerMessages[T]["response"]) => void
    ) {
        const callbacks = this.topicToCallbacks.get(topic);
        if (callbacks) {
            this.topicToCallbacks.set(
                topic,
                callbacks.filter((element) => element != callback)
            );

            if (this.topicToCallbacks.get(topic)?.length == 0) {
                this.topicToCallbacks.delete(topic);
            }
        } else {
            console.warn(`Topic ${topic} doesn't exist in topicToHandlers`);
        }

        this.ws.send(JSON.stringify({ topic, payload: false }));
    }

    public exchange<T extends ExchangeTopic>(
        topic: T,
        req: HandlerMessages[T]["request"],
        cb: (res: HandlerMessages[T]["response"], end: () => void) => void
    ) {
        console.log(req);
        this.ws.send(JSON.stringify({ topic, payload: req }));

        const resCallback = (value: any) => {
            cb(value, () => {
                const callbacks = this.topicToCallbacks.get(topic);
                if (callbacks) {
                    this.topicToCallbacks.set(
                        topic,
                        callbacks.filter((element) => element != resCallback)
                    );
                }
            });
        };

        const callbacks = this.topicToCallbacks.get(topic);
        if (callbacks) {
            this.topicToCallbacks.set(topic, [...callbacks, resCallback]);
        } else {
            this.topicToCallbacks.set(topic, [resCallback]);
        }
    }
}

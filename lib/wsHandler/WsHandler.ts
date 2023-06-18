import { HandlerMessages } from "./HandlerMessages";
import {
    ExchangeTopic,
    PostTopic,
    SubscriptionTopic,
    WsMessage,
} from "./types";

type Callback<T> = {
    id: string;
    cb: (value: T) => void;
};

export class WsHandler {
    private ws: WebSocket;
    private topicToCallbacks: Map<string, Array<Callback<any>>> = new Map();

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
                callback.cb(socketMessage.payload);
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
        callback: Callback<HandlerMessages[T]["response"]>
    ) {
        const callbacks = this.topicToCallbacks.get(topic);
        if (callbacks) {
            this.topicToCallbacks.set(topic, [...callbacks, callback]);
        } else {
            this.topicToCallbacks.set(topic, [callback]);
        }

        this.ws.send(
            JSON.stringify({
                topic,
                id: callback.id,
                payload: { subscribe: true, id: callback.id },
            })
        );
    }

    public unsubscribe<T extends SubscriptionTopic>(
        topic: T,
        id: HandlerMessages[T]["id"]
    ) {
        const callbacks = this.topicToCallbacks.get(topic);
        if (callbacks) {
            this.topicToCallbacks.set(
                topic,
                callbacks.filter((element) => element.id != id)
            );

            if (this.topicToCallbacks.get(topic)?.length == 0) {
                this.topicToCallbacks.delete(topic);
            }
        } else {
            console.warn(`Topic ${topic} doesn't exist in topicToHandlers`);
        }

        this.ws.send(
            JSON.stringify({ topic, payload: { subscribe: false, id: id } })
        );
    }

    public exchange<T extends ExchangeTopic>(
        topic: T,
        req: HandlerMessages[T]["request"],
        id: string,
        cb: (res: HandlerMessages[T]["response"], end: () => void) => void
    ) {
        this.ws.send(JSON.stringify({ topic, payload: req }));
        const resCallback = (value: any) => {
            cb(value, () => {
                const callbacks = this.topicToCallbacks.get(topic);
                if (callbacks) {
                    this.topicToCallbacks.set(
                        topic,
                        callbacks.filter((element) => element.id != id)
                    );
                }
            });
        };
        const callbacks = this.topicToCallbacks.get(topic);
        if (callbacks) {
            this.topicToCallbacks.set(topic, [
                ...callbacks,
                { id: id, cb: resCallback },
            ]);
        } else {
            this.topicToCallbacks.set(topic, [{ id: id, cb: resCallback }]);
        }
    }
}

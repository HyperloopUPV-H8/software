import { HandlerMessages } from "./HandlerMessages";
import {
    ExchangeTopic,
    PostTopic,
    SubscriptionTopic,
    WsMessage,
} from "./types";

type Suscription<T> = {
    id: string;
    cb: (value: T) => void;
};

export class WsHandler {
    private url: string;
    private onOpen?: () => void;
    private onClose?: () => void;

    private ws!: WebSocket;
    private topicToSuscriptions: Map<string, Suscription<any>[]>;

    constructor(
        url: string,
        topicToSuscriptions?: Map<string, Suscription<any>[]>,
        onOpen?: () => void,
        onClose?: () => void
    ) {
        this.url = url;
        this.onOpen = onOpen;
        this.onClose = onClose;
        this.topicToSuscriptions = topicToSuscriptions ?? new Map();
        this.setupWs(url, onOpen, onClose);
    }

    private setupWs(url: string, onOpen?: () => void, onClose?: () => void) {
        this.ws = new WebSocket(`ws://${url}`);

        this.ws.onopen = () => {
            for (const [
                topic,
                callbacks,
            ] of this.topicToSuscriptions.entries()) {
                for (const cb of callbacks) {
                    this.ws.send(getSubscriptionMessage(topic, cb.id));
                }
            }
            onOpen?.();
        };

        this.ws.onmessage = (ev: MessageEvent<string>) => {
            const socketMessage = JSON.parse(ev.data) as WsMessage;
            const callbacks =
                this.topicToSuscriptions.get(socketMessage.topic) ?? [];
            for (const callback of callbacks) {
                callback.cb(socketMessage.payload);
            }
        };

        this.ws.onclose = () => {
            onClose?.();
        };
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
        suscription: Suscription<HandlerMessages[T]["response"]>
    ) {
        const suscriptions = this.topicToSuscriptions.get(topic);
        if (suscriptions) {
            suscriptions.push(suscription);
            this.topicToSuscriptions.set(topic, suscriptions);
        } else {
            this.topicToSuscriptions.set(topic, [suscription]);
        }

        this.ws.send(getSubscriptionMessage(topic, suscription.id));
    }

    public unsubscribe<T extends SubscriptionTopic>(
        topic: T,
        id: HandlerMessages[T]["id"]
    ) {
        const callbacks = this.topicToSuscriptions.get(topic);
        if (callbacks) {
            this.topicToSuscriptions.set(
                topic,
                callbacks.filter((element) => element.id != id)
            );

            if (this.topicToSuscriptions.get(topic)?.length == 0) {
                this.topicToSuscriptions.delete(topic);
            }
        } else {
            console.warn(`Topic ${topic} doesn't exist in topicToSuscriptions`);
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
                const callbacks = this.topicToSuscriptions.get(topic);
                if (callbacks) {
                    this.topicToSuscriptions.set(
                        topic,
                        callbacks.filter((element) => element.id != id)
                    );
                }
            });
        };
        const callbacks = this.topicToSuscriptions.get(topic);
        if (callbacks) {
            this.topicToSuscriptions.set(topic, [
                ...callbacks,
                { id: id, cb: resCallback },
            ]);
        } else {
            this.topicToSuscriptions.set(topic, [{ id: id, cb: resCallback }]);
        }
    }

    public getUrl() {
        return this.url;
    }

    public getTopicToSuscriptions() {
        return this.topicToSuscriptions;
    }

    public getOnOpen() {
        return this.onOpen;
    }

    public getOnClose() {
        return this.onClose;
    }
}

function getSubscriptionMessage(topic: string, id: string) {
    return JSON.stringify({
        topic,
        id: id,
        payload: { subscribe: true, id: id },
    });
}

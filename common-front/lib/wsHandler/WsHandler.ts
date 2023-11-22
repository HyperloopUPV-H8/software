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
    private ws!: WebSocket;
    private topicToSuscriptions: Map<string, Suscription<any>[]> = new Map();

    constructor(
        url: string,
        reconnect: boolean,
        onOpen?: () => void,
        onClose?: () => void
    ) {
        this.setupWs(url, reconnect, onOpen, onClose);
    }

    private setupWs(
        url: string,
        reconnect: boolean,
        onOpen?: () => void,
        onClose?: () => void
    ) {
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
            console.log(socketMessage)
            const callbacks =
                this.topicToSuscriptions.get(socketMessage.topic) ?? [];
            for (const callback of callbacks) {
                callback.cb(socketMessage.payload);
            }
        };

        this.ws.onclose = () => {
            onClose?.();
            if (reconnect) {
                setTimeout(() => {
                    this.setupWs(url, reconnect, onOpen, onClose);
                }, 500);
            }
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
        this.addCallback(topic, suscription.id, suscription.cb);
        this.ws.send(getSubscriptionMessage(topic, suscription.id));
    }

    public unsubscribe<T extends SubscriptionTopic>(
        topic: T,
        id: HandlerMessages[T]["id"]
    ) {
        this.removeCallback(topic, id);
        this.ws.send(
            JSON.stringify({ topic, payload: { subscribe: false, id: id } })
        );
    }

    public exchange<T extends ExchangeTopic>(
        topic: T,
        req: HandlerMessages[T]["request"],
        id: string,
        cb: (
            res: HandlerMessages[T]["response"],
            send: (req: HandlerMessages[T]["request"]) => void,
            end: () => void
        ) => void
    ) {
        this.ws.send(JSON.stringify({ topic, payload: req }));
        const resCallback = (value: any) => {
            cb(
                value,
                (req) => this.ws.send(JSON.stringify({ topic, payload: req })),
                () => this.removeCallback(topic, id)
            );
        };

        this.addCallback(topic, id, resCallback);
    }

    private addCallback(topic: string, id: string, cb: (v: any) => void) {
        const suscriptions = this.topicToSuscriptions.get(topic);
        if (suscriptions) {
            suscriptions.push({ id, cb });
            this.topicToSuscriptions.set(topic, suscriptions);
        } else {
            this.topicToSuscriptions.set(topic, [{ id, cb }]);
        }
    }

    private removeCallback(topic: string, id: string) {
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
    }
}

function getSubscriptionMessage(topic: string, id: string) {
    return JSON.stringify({
        topic,
        id: id,
        payload: { subscribe: true, id: id },
    });
}

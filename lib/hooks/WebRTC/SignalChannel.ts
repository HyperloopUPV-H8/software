import { Signal, SignalHandles, SignalKinds, SignalPayloadMap } from "./signal";

export class SignalChannel {
    readonly socket: WebSocket;

    private listeners: SignalHandles = {
        offer: this.emptyHandle.bind(this),
        answer: this.emptyHandle.bind(this),
        candidate: this.emptyHandle.bind(this),
        close: this.emptyHandle.bind(this),
        poll: this.emptyHandle.bind(this),
    };

    private signalBuffer = new Array<Signal<SignalKinds>>();

    constructor(url: string, protocols?: string | string[]) {
        this.socket = new WebSocket(url, protocols);

        this.socket.onopen = () => {
            this.signalBuffer.forEach((signal) => {
                this.socket.send(JSON.stringify(signal));
            });
        };

        this.socket.onmessage = <Kind extends SignalKinds>(
            msg: MessageEvent<any>
        ) => {
            const signal: Signal<Kind> = JSON.parse(msg.data);

            this.listeners[signal.name](signal);
        };
    }

    addSignalListener<Kind extends SignalKinds>(
        signal: Kind,
        handle: SignalHandles[Kind]
    ) {
        this.listeners[signal] = handle;
    }

    removeSignalListener<Kind extends SignalKinds>(signal: Kind) {
        this.listeners[signal] = this.emptyHandle.bind(this);
    }

    sendSignal<Kind extends SignalKinds>(
        kind: Kind,
        payload: SignalPayloadMap[Kind]
    ) {
        const signal: Signal<Kind> = {
            name: kind,
            payload: payload,
        };

        if (this.socket.readyState !== WebSocket.OPEN) {
            this.signalBuffer.push(signal);
            return;
        }

        this.socket.send(JSON.stringify(signal));
    }

    close() {
        this.socket.close();
    }

    onError(handle: (ev: Event) => void) {
        this.socket.onerror = handle;
    }

    onClose(handle: (ev: CloseEvent) => void) {
        this.socket.onclose = handle;
    }

    private emptyHandle<Kind extends SignalKinds>(_: Signal<Kind>) {}
}

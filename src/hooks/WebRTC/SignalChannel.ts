export class SignalChannel {
    readonly socket: WebSocket

    private readonly defaultHandles: SignalHandles = {
        "offer": this.emptyHandle.bind(this),
        "answer": this.emptyHandle.bind(this),
        "candidate": this.emptyHandle.bind(this),
        "close": this.handleClose.bind(this),
        "reject": this.handleReject.bind(this),
        "keepalive": this.handleKeepalive.bind(this),
    }
    private handles: SignalHandles = { ...this.defaultHandles }

    constructor(url: string, protocols?: string | string[]) {
        this.socket = new WebSocket(url, protocols)

        this.socket.onmessage = <Kind extends SignalKinds>(msg: MessageEvent<any>) => {
            const signal: Signal<Kind> = JSON.parse(msg.data)
            console.log(signal)
            this.handles[signal.signal](signal)
        }

        this.socket.onclose = () => this.socket.close
    }

    addSignalListener<Kind extends SignalKinds>(signal: Kind, handle: SignalHandles[Kind]) {
        this.handles[signal] = handle
    }

    removeSignalListener<Kind extends SignalKinds>(signal: Kind) {
        this.handles[signal] = this.defaultHandles[signal]
    }

    sendSignal<Kind extends SignalKinds>(kind: Kind, payload: SignalPayloadMap[Kind]) {
        const signal: Signal<Kind> = {
            signal: kind,
            payload: payload,
        }
        console.log(signal)
        this.socket.send(JSON.stringify(signal))
    }

    sendError(code: RejectPayload["code"], origin?: RejectPayload["origin"], reason?: RejectPayload["reason"]) {
        this.sendSignal("reject", {
            code: code,
            origin: origin,
            reason: reason,
        })
    }

    sendClose(code: ClosePayload["code"], reason?: ClosePayload["reason"]) {
        this.sendSignal("close", {
            code: code,
            reason: reason,
        })

        this.socket.close()
    }

    emptyHandle<Kind extends SignalKinds>(_: Signal<Kind>) { }

    handleKeepalive(signal: Signal<"keepalive">) {
        this.socket.send(JSON.stringify(signal))
    }

    handleClose(signal: Signal<"close">) {
        this.socket.close()
        console.warn(`signal channel closed, code: ${signal.payload.code}, reason: "${signal.payload.reason}"`)
    }

    handleReject(signal: Signal<"reject">) {
        console.error(`${signal.payload.origin?.signal} rejected, code: ${signal.payload.code}, reason: "${signal.payload.reason}"`)
    }
}

import { useEffect, useRef, useState } from "react";

export type Signal = {
    event: "answer" | "offer" | "candidate" | "reject" | "close"
    payload: string | RTCIceCandidateInit
}

export function useSignal(addr: string, onSignal: (sig: Signal) => void): (sig: Signal) => boolean {
    const websocket = useRef<WebSocket | null>()

    useEffect(() => {
        connectSignal()
    }, [])

    function sendSignal(signal: Signal): boolean {
        if (!websocket.current) {
            return false
        }

        websocket.current.send(JSON.stringify(signal))

        return true
    }

    function closeSignal(reason: string) {
        console.log("signal channel closed, reason:", reason)
        if (!websocket.current) {
            return
        }

        websocket.current.send(JSON.stringify({ event: "close", payload: "ok" }))
        websocket.current.close()
        websocket.current = null
    }

    function connectSignal() {
        const socket = new WebSocket(addr)
        websocket.current = socket

        socket.onclose = _ => closeSignal("")

        socket.onmessage = ev => {
            const sig: Signal = JSON.parse(ev.data)

            if (sig.event === "reject" && typeof sig.payload === "string") {
                console.log("last signal rejected, reason:", sig.payload)
            } else if (sig.event === "close" && typeof sig.payload === "string") {
                closeSignal(sig.payload)
            } else {
                console.log(sig)
                onSignal(sig)
            }
        }
    }

    return sendSignal
}
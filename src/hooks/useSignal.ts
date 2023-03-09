import { useEffect, useRef, useState } from "react";

export type Signal = SignalEvent | SignalCandidate;

type SignalEvent = {
    event: "answer" | "offer" | "reject" | "close";
    payload: string;
};

type SignalCandidate = {
    event: "candidate";
    payload: RTCIceCandidateInit;
};

export function useSignal(
    addr: string,
    onSignal: (sig: Signal) => void
) {
    const websocket = useRef<WebSocket>(null!);
    const [state, setState] = useState<number>(WebSocket.CONNECTING)

    useEffect(() => {
        connectSignal();
    }, []);

    function connectSignal() {
        websocket.current = new WebSocket(addr);

        websocket.current.onclose = _ => closeSignal("ok");

        websocket.current.onmessage = ev => {
            const sig: Signal = JSON.parse(ev.data);

            if (sig.event === "close") {
                closeSignal("ok")
            }

            console.log("signal:", sig);
            onSignal(sig);
        };

        websocket.current.onopen = _ => setState(WebSocket.OPEN)
    }

    function sendSignal(signal: Signal) {
        websocket.current.send(JSON.stringify(signal));
    }

    function closeSignal(reason: string) {
        if (websocket.current.readyState === WebSocket.CLOSING || websocket.current.readyState === WebSocket.CLOSED) {
            return
        }

        console.log("signal channel closed, reason:", reason);
        if (!websocket.current) {
            return;
        }

        websocket.current.send(
            JSON.stringify({ event: "close", payload: "ok" })
        );
        websocket.current.close();
    }

    return [sendSignal, closeSignal, state] as const;
}

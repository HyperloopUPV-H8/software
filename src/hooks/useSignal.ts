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
): (sig: Signal) => boolean {
    const websocket = useRef<WebSocket | null>();

    useEffect(() => {
        connectSignal();
    }, []);

    function connectSignal() {
        websocket.current = new WebSocket(addr);

        websocket.current.onclose = (_) => {
            console.log("closed signaling websocket");
        };

        websocket.current.onmessage = (ev) => {
            const sig: Signal = JSON.parse(ev.data);

            if (sig.event === "reject") {
                console.log("last signal rejected, reason:", sig.payload);
            } else if (sig.event === "close") {
                closeSignal(sig.payload);
            } else {
                console.log("signal:", sig);
                onSignal(sig);
            }
        };
    }

    function sendSignal(signal: Signal): boolean {
        if (!websocket.current) {
            return false;
        }

        websocket.current.send(JSON.stringify(signal));

        return true;
    }

    function closeSignal(reason: string) {
        console.log("signal channel closed, reason:", reason);
        if (!websocket.current) {
            return;
        }

        websocket.current.send(
            JSON.stringify({ event: "close", payload: "ok" })
        );
        websocket.current.close();
        websocket.current = null;
    }

    return sendSignal;
}

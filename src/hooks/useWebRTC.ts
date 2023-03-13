import { useEffect, useRef, useState } from "react";
import { Signal, useSignal } from "./useSignal";

export type WebRTCState = "rejected" | RTCPeerConnectionState;

export function useWebRTC(signalAddr: string, config?: RTCConfiguration) {
    const videoElement = useRef<HTMLVideoElement>(null!);
    const [state, setState] = useState<WebRTCState>("new");
    const remotePeer = useRef<RTCPeerConnection>(null!);

    function onSignal(signal: Signal) {
        if (signal.event === "answer") {
            onAnswer(signal.payload);
        } else if (signal.event === "candidate") {
            onSignalIceCandidate(signal.payload);
        } else if (signal.event === "reject") {
            updateState("rejected");
        } else if (signal.event === "close") {
            closePeer();
        }
    }

    async function onAnswer(answer: string) {
        await remotePeer.current.setRemoteDescription({
            type: "answer",
            sdp: answer,
        });
    }

    async function onSignalIceCandidate(candidate: RTCIceCandidateInit) {
        await remotePeer.current.addIceCandidate(candidate);
    }

    const [sendSignal, closeSignal, signalState] = useSignal(
        signalAddr,
        onSignal
    );

    useEffect(() => {
        remotePeer.current = new RTCPeerConnection(config);
        remotePeer.current.addTransceiver("video");

        remotePeer.current.onconnectionstatechange = (_) => updateState();
        remotePeer.current.onicecandidate = (ev) =>
            onIceCandidate(ev.candidate);
        remotePeer.current.ontrack = (ev) => onTrack(ev.streams[0]);

        window.onunload = (_) => onUnload();
    }, []);

    useEffect(() => {
        if (signalState === WebSocket.OPEN) {
            handshake();
        }
    }, [signalState]);

    async function onUnload() {
        closeSignal("leaving");
    }

    async function onTrack(stream: MediaStream) {
        videoElement.current.srcObject = stream;
    }

    async function handshake() {
        const offer = await remotePeer.current.createOffer();
        if (!offer.sdp) {
            sendSignal({
                event: "close",
                payload: "failed to create offer",
            });
            return;
        }

        await remotePeer.current.setLocalDescription({
            type: "offer",
            sdp: offer.sdp,
        });
        sendSignal({
            event: "offer",
            payload: offer.sdp,
        });
    }

    async function updateState(newState?: WebRTCState) {
        if (newState) {
            setState(newState);
            return;
        }

        setState((prev) => {
            if (prev === "rejected") {
                return prev;
            }
            return remotePeer.current.connectionState;
        });
    }

    async function onIceCandidate(candidate: RTCIceCandidate | null) {
        if (!candidate) {
            return;
        }

        sendSignal({
            event: "candidate",
            payload: candidate.toJSON(),
        });
    }

    async function closePeer() {
        remotePeer.current.close();
    }

    return [state, videoElement] as const;
}

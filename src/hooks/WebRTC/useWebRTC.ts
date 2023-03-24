import { useEffect, useRef, useState } from "react";
import { SignalChannel } from "./SignalChannel";

export function useWebRTC(signalUrl: string, configuration?: RTCConfiguration) {
    const signalChannel = useRef<SignalChannel | null>(null); //TODO: arreglar lo de esta exclamacion rara
    const peer = useRef<RTCPeerConnection | null>(null);
    const [peerState, setPeerState] = useState<RTCPeerConnectionState>("new");
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    
    useEffect(() => {
        peer.current = new RTCPeerConnection(configuration);
        peer.current.addTransceiver("video");
        peer.current.onconnectionstatechange = () =>
            setPeerState(peer.current!.connectionState);
        peer.current.onicecandidate = handleCandidate;
        peer.current.ontrack = handleTrack;

        signalChannel.current = new SignalChannel(signalUrl);
        signalChannel.current.addSignalListener("answer", handleAnswerSignal);
        signalChannel.current.addSignalListener(
            "candidate",
            handleCandidateSignal
        );

        signalChannel.current.socket.onopen = () => startHandshake();
    }, []);

    function startHandshake() {
        console.log("start handshake");

        peer.current!.createOffer().then(
            (offer: RTCSessionDescriptionInit) => sendAndUpdateOffer(offer),
            (reason: Error) =>
                signalChannel.current!.sendClose(
                    SignalCode.FailCreateOffer,
                    reason.message
                )
        );
    }

    function sendAndUpdateOffer(offer: RTCSessionDescriptionInit) {
        peer.current!.setLocalDescription(offer).then(
            () => signalChannel.current!.sendSignal("offer", offer),
            (reason: Error) =>
                signalChannel.current!.sendClose(
                    SignalCode.FailUpdateLocalOffer,
                    reason.message
                )
        );
    }

    function handleCandidate(ev: RTCPeerConnectionIceEvent) {
        if (!ev.candidate) {
            return;
        }


        signalChannel.current!.sendSignal("candidate", ev.candidate.toJSON());
    }

    function handleTrack(ev: RTCTrackEvent) {
        setMediaStream(ev.streams[0]);
    }

    function handleCandidateSignal(signal: Signal<"candidate">) {
        peer.current!.addIceCandidate(signal.payload).then(
            () => console.log("add candidate"),
            (reason: Error) =>
                signalChannel.current!.sendError(
                    SignalCode.FailAddCandidate,
                    signal,
                    reason.message
                )
        );
    }

    function handleAnswerSignal(signal: Signal<"answer">) {
        peer.current!.setRemoteDescription(signal.payload).then(
            () => console.log("set answer"),
            (reason: Error) =>
                signalChannel.current!.sendError(
                    SignalCode.FailUpdateRemoteAnswer,
                    signal,
                    reason.message
                )
        );
    }


    return [mediaStream, peerState] as const;
}

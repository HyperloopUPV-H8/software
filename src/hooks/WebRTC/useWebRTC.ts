import { useEffect, useRef, useState } from "react";
import { SignalChannel } from "./SignalChannel";

export function useWebRTC(signalUrl: string, configuration?: RTCConfiguration) {
    const signalChannel = useRef<SignalChannel | null>(null); //TODO: arreglar lo de esta exclamacion rara
    const peer = useRef<RTCPeerConnection | null>(null);
    const [peerState, setPeerState] = useState<RTCPeerConnectionState>("new");
    const [mediaStreams, setMediaStreams] = useState<MediaStream[] | null>(null);

    useEffect(() => {
        peer.current = new RTCPeerConnection(configuration);
        peer.current.addTransceiver("video");
        peer.current.onconnectionstatechange = () =>
            setPeerState(peer.current!.connectionState);
        peer.current.onicecandidate = handleCandidate;
        peer.current.ontrack = handleTrack;

        signalChannel.current = new SignalChannel(signalUrl);
        signalChannel.current.addSignalListener("offer", handleOfferSignal);
        signalChannel.current.addSignalListener("candidate", handleCandidateSignal);
    }, []);

    function sendAndUpdateAnswer() {
        peer.current!.createAnswer().then(
            (answer) => {
                signalChannel.current!.sendSignal("answer", answer)
                peer.current!.setLocalDescription(answer)
            }
        )
    }

    function handleCandidate(ev: RTCPeerConnectionIceEvent) {
        if (!ev.candidate) {
            return;
        }

        signalChannel.current!.sendSignal("candidate", ev.candidate.toJSON());
    }

    function handleTrack(ev: RTCTrackEvent) {
        console.log(ev)
        setMediaStreams(prevStreams => prevStreams ? [...prevStreams, ...ev.streams] : [...ev.streams]);
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

    function handleOfferSignal(signal: Signal<"offer">) {
        peer.current!.setRemoteDescription(signal.payload).then(
            () => sendAndUpdateAnswer()
        )
    }


    return [mediaStreams, peerState] as const;
}
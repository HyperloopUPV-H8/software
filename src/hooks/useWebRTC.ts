import { useEffect, useRef, useState } from "react";
import { Signal, useSignal } from "./useSignal";

export function useWebRTC(signalAddr: string, config?: RTCConfiguration) {
    const [state, setState] = useState<RTCPeerConnectionState>("new");
    const peer = useRef<RTCPeerConnection>();
    const videoElement = useRef<HTMLVideoElement | null>(null);
    const [stream, setStream] = useState<MediaStream>();

    useEffect(() => {
        console.log("stream:", stream, "videoElement", videoElement.current);
        if (stream && videoElement.current) {
            console.log("set stream to video!");
            videoElement.current.srcObject = stream;
        }
    }, [videoElement.current, stream]);

    const onSignal = async (lastSignal: Signal) => {
        if (lastSignal.event === "offer") {
            onSignalOffer(lastSignal.payload);
        } else if (lastSignal.event === "candidate") {
            onSignalCandidate(lastSignal.payload);
        }
    };

    const sendSignal = useSignal(signalAddr, onSignal);

    async function onSignalOffer(offer: string) {
        peer.current = new RTCPeerConnection(config);

        peer.current.onconnectionstatechange = () => {
            if (!peer.current) {
                return;
            }

            setState(peer.current.connectionState);
        };

        peer.current.addTransceiver("video");

        await peer.current.setRemoteDescription({ type: "offer", sdp: offer });

        const answer = await peer.current.createAnswer();

        if (!answer.sdp) {
            sendSignal({ event: "close", payload: "failed to create answer" });
            return;
        }

        console.log("Created answer");

        const wasAnwserSignalSent = sendSignal({
            event: "answer",
            payload: answer.sdp,
        });

        console.log(wasAnwserSignalSent);
        await peer.current.setLocalDescription(answer);

        peer.current.onicecandidate = (ev) => {
            if (!ev.candidate) {
                return;
            }

            sendSignal({ event: "candidate", payload: ev.candidate.toJSON() });
        };

        peer.current.ontrack = (ev) => {
            console.log("GOT THE TRACK");
            setStream(ev.streams[0]);
        };
    }

    async function onSignalCandidate(candidate: RTCIceCandidateInit) {
        if (!peer.current) {
            sendSignal({ event: "reject", payload: "peer not ready" });
            sendSignal({ event: "close", payload: "peer not ready" });
            return;
        }

        peer.current.addIceCandidate(candidate);
    }

    return [state, videoElement] as const;
}

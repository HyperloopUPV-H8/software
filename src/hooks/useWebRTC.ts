import { useEffect, useRef, useState } from "react";
import { Signal, useSignal } from "./useSignal";



export function useWebRTC(signalAddr: string, config?: RTCConfiguration): [RTCPeerConnectionState, React.MutableRefObject<HTMLVideoElement | null>] {
    const [state, setState] = useState<RTCPeerConnectionState>("new")
    let peer = useRef<RTCPeerConnection>()
    const videoElement = useRef<HTMLVideoElement | null>(null)

    const onSignal = async (lastSignal: Signal) => {
        if (lastSignal.event === "offer" && typeof lastSignal.payload === "string") {
            await onSignalOffer(lastSignal.payload)
        } else if (lastSignal.event === "candidate" && lastSignal.payload instanceof RTCIceCandidate) {
            onSignalCandidate(lastSignal.payload)
        }
    }
    const sendSignal = useSignal(signalAddr, onSignal)


    async function onSignalOffer(offer: string) {
        peer.current = new RTCPeerConnection(config)
        peer.current.onconnectionstatechange = _ => {
            if (!peer.current) {
                return
            }

            setState(peer.current.connectionState)
        }

        peer.current.addTransceiver("video")

        await peer.current.setRemoteDescription({ type: "offer", sdp: offer })

        const answer = await peer.current.createAnswer()

        if (!answer.sdp) {
            sendSignal({ event: "close", payload: "failed to create answer" })
            return
        }

        console.log("answer")

        sendSignal({ event: "answer", payload: answer.sdp })
        await peer.current.setLocalDescription(answer)

        peer.current.onicecandidate = ev => {
            if (!ev.candidate) {
                return
            }

            sendSignal({ event: "candidate", payload: ev.candidate.toJSON() })
        }

        peer.current.ontrack = ev => {
            while (!videoElement.current) {}

            videoElement.current.srcObject = ev.streams[0]
        }
    }

    async function onSignalCandidate(candidate: RTCIceCandidateInit) {
        if (!peer.current) {
            sendSignal({ event: "reject", payload: "peer not ready" })
            sendSignal({ event: "close", payload: "peer not ready" })
            return
        }

        peer.current.addIceCandidate(candidate)
    }


    return [state, videoElement]
}
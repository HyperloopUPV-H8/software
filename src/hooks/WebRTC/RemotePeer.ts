import { SignalChannel } from "./SignalChannel"
import { Signal, SignalHandles, SignalKinds, SignalPayloadMap } from "./signal"


export class RemotePeer {
    peer: RTCPeerConnection
    signal: SignalChannel
    private candidateBuffer = new Array<RTCIceCandidateInit>()

    constructor(signalAddr: string, configuration?: RTCConfiguration) {
        this.peer = new RTCPeerConnection(configuration)
        this.signal = new SignalChannel(signalAddr)

        this.peer.onnegotiationneeded = this.onNegotiationNeeded.bind(this)
        this.peer.onicecandidate = this.onIceCandidate.bind(this)
        this.peer.onsignalingstatechange = this.onSignalingStateChange.bind(this)

        this.signal.addSignalListener("offer", this.onOfferSignal.bind(this))
        this.signal.addSignalListener("answer", this.onAnswerSignal.bind(this))
        this.signal.addSignalListener("candidate", this.onCandidateSignal.bind(this))
        this.signal.addSignalListener("close", this.onCloseSignal.bind(this))
        this.signal.onClose(this.onClose.bind(this))
        this.signal.onError(this.onError.bind(this))
    }

    private async onIceCandidate(ev: RTCPeerConnectionIceEvent) {
        if (!ev.candidate) {
            return
        }

        this.signal.sendSignal("candidate", ev.candidate.toJSON())
    }

    private async onNegotiationNeeded() {
        const offer = await this.peer.createOffer()
        await this.peer.setLocalDescription(offer)
        this.signal.sendSignal("offer", offer)
    }

    private async onOfferSignal(signal: Signal<"offer">) {
        await this.peer.setRemoteDescription(signal.payload)
        const answer = await this.peer.createAnswer()
        await this.peer.setLocalDescription(answer)
        this.signal.sendSignal("answer", answer)
    }

    private async onAnswerSignal(signal: Signal<"answer">) {
        await this.peer.setRemoteDescription(signal.payload)
    }

    private async onCloseSignal(_signal: Signal<"close">) {
        this.close()
    }

    private async onCandidateSignal(signal: Signal<"candidate">) {
        if (this.peer.signalingState === "stable" || this.peer.signalingState === "have-remote-offer" || this.peer.signalingState === "have-remote-pranswer") {
            await this.peer.addIceCandidate(signal.payload)
            return
        }

        this.candidateBuffer.push(signal.payload)
    }

    private async onSignalingStateChange() {
        if (this.peer.signalingState !== "stable" && this.peer.signalingState !== "have-remote-offer" && this.peer.signalingState !== "have-remote-pranswer") {
            return
        }

        for (const candidate of this.candidateBuffer) {
            await this.peer.addIceCandidate(candidate)
        }
    }

    private onClose() {
        this.close()
    }

    private onError() {
        this.close()
    }

    close() {
        this.peer.close()
        this.signal.sendSignal("close", null)
        this.signal.close()
    }

    onTrack(callback: (track: RTCTrackEvent) => void) {
        this.peer.ontrack = callback
    }

    onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void) {
        this.peer.onconnectionstatechange = () => callback(this.peer.connectionState)
    }
}
import { useEffect, useRef, useState } from "react";
import { RemotePeer } from "./RemotePeer";

export function useWebRTC(signalUrl: string, configuration?: RTCConfiguration) {
    const peer = useRef<RemotePeer>();
    const [peerState, setPeerState] = useState<RTCPeerConnectionState>("new");
    const [mediaStreams, setMediaStreams] = useState<MediaStream[] | null>(null);

    useEffect(() => {
        peer.current = new RemotePeer(signalUrl, configuration);
        peer.current.onTrack(handleTrack);
        peer.current.onConnectionStateChange(setPeerState);

        return () => {
            peer.current!.close();
        }
    }, []);


    function handleTrack(ev: RTCTrackEvent) {
        console.log(ev)
        setMediaStreams(prevStreams => prevStreams ? [...prevStreams, ...ev.streams] : [...ev.streams]);
    }

    return [mediaStreams, peerState] as const;
}
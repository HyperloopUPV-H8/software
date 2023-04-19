import { useRef, useEffect } from "react";

export function useMediaStream(stream: MediaStream) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.srcObject = stream;
        } else {
            console.error("video ref is", ref.current);
        }
    }, [stream]);

    return ref;
}

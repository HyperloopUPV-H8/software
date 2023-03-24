import styles from "./Camera.module.scss";
import { useRef, useEffect } from "react";

type Props = {
    stream: MediaStream;
    className?: string;
};

export const Camera = ({ stream, className = "" }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        } else {
            console.error("video ref is", videoRef.current);
        }
    }, [stream]);

    return (
        <div className={`${styles.videoWrapper} ${className}`}>
            <video
                ref={videoRef}
                muted
                loop
                playsInline
                autoPlay
                className={`${styles.video}`}
            ></video>
        </div>
    );
};

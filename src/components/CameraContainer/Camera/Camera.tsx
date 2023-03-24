import styles from "./Camera.module.scss";
import { useRef, useEffect } from "react";
import { useMediaStream } from "./useMediaStream";

type Props = {
    stream: MediaStream;
    className?: string;
};

export const Camera = ({ stream, className = "" }: Props) => {
    const ref = useMediaStream(stream);

    return (
        <div className={`${styles.videoWrapper} ${className}`}>
            <video
                ref={ref}
                muted
                loop
                playsInline
                autoPlay
                className={`${styles.video}`}
            ></video>
        </div>
    );
};

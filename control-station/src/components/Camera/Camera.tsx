import styles from "./Camera.module.scss";
import { HTMLAttributes } from "react";

import { useMediaStream } from "./useMediaStream";

type Props = {
    stream: MediaStream;
} & HTMLAttributes<HTMLDivElement>;

export const Camera = ({ stream, ...props }: Props) => {
    const ref = useMediaStream(stream);

    const className = `${styles.videoWrapper} ${props.className ?? ""}`;

    return (
        <div
            {...props}
            className={className}
        >
            <video
                ref={ref}
                muted
                loop
                playsInline
                autoPlay
                disablePictureInPicture // Not supported in firefox
                className={`${styles.video}`}
            ></video>
        </div>
    );
};

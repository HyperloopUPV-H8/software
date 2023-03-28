import styles from "./CameraContainer.module.scss";
import { useWebRTC } from "hooks/WebRTC/useWebRTC";
import { Camera } from "./Camera/Camera";
import { HTMLAttributes } from "react";

type Props = {
    signalUrl: string;
} & HTMLAttributes<HTMLDivElement>;

export const CameraContainer = ({ signalUrl, ...props }: Props) => {
    const [stream, state] = useWebRTC(signalUrl);

    if (stream) {
        return (
            <Camera
                stream={stream}
                {...props}
            />
        );
    } else {
        return (
            <div className={styles.notConnected}>Camera is not connected</div>
        );
    }
};

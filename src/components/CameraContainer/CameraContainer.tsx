import styles from "./CameraContainer.module.scss";
import { useWebRTC } from "hooks/WebRTC/useWebRTC";
import { Camera } from "./Camera/Camera";

type Props = {
    className: string;
};

export const CameraContainer = ({ className }: Props) => {
    const [stream, state] = useWebRTC("ws://192.168.0.5:50000/signal");

    if (stream) {
        return (
            <Camera
                stream={stream}
                className={className}
            />
        );
    } else {
        return (
            <div className={styles.notConnected}>Camera is not connected</div>
        );
    }
};

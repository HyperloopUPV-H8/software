import styles from "./CameraContainer.module.scss";
import { useWebRTC } from "hooks/WebRTC/useWebRTC";
import { Camera } from "./Camera/Camera";

type Props = {
    signalUrl: string;
    className?: string;
};

export const CameraContainer = ({ signalUrl, className = "" }: Props) => {
    const [stream, state] = useWebRTC(signalUrl);

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

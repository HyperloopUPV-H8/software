import styles from "./CamerasContainer.module.scss";

import { useWebRTC } from "hooks/WebRTC/useWebRTC";
import { Cameras } from "./Cameras/Cameras";
import { AnimatedEllipsis } from "components/AnimatedEllipsis/AnimatedEllipsis";

export const CamerasContainer = () => {
    const [streams, state] = useWebRTC(import.meta.env.VITE_CAMERA_1_URL);

    if (streams) {
        return (
            <Cameras
                streams={streams}
                className={styles.cameras}
            />
        );
    } else {
        return (
            <div className={`${styles.loading} ${styles.cameras}`}>
                Loading cameras
                <AnimatedEllipsis />
            </div>
        );
    }
};

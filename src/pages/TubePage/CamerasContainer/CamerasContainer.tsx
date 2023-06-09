import styles from "./CamerasContainer.module.scss";

import { config, useWebRTC } from "common";
import { Cameras } from "./Cameras/Cameras";
import { AnimatedEllipsis } from "components/AnimatedEllipsis/AnimatedEllipsis";

const CAMERAS_URL = `ws://${config.cameras.ip}:${config.cameras.port}`;

export const CamerasContainer = () => {
    const [streams, state] = useWebRTC(CAMERAS_URL);
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

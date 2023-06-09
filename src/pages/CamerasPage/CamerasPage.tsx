import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./CamerasPage.module.scss";
import { Cameras } from "pages/CamerasPage/Cameras/Cameras";
import { config, useWebRTC } from "common";
import { AnimatedEllipsis } from "components/AnimatedEllipsis/AnimatedEllipsis";

const CAMERAS_URL = `ws://${config.cameras.ip}:${config.cameras.port}`;

export const CamerasPage = () => {
    const [streams, _state] = useWebRTC(CAMERAS_URL);

    if (streams) {
        return (
            <div className={styles.camerasPageWrapper}>
                <Cameras streams={streams} />
                {/* <CamerasFooter /> */}
            </div>
        );
    } else {
        return (
            <div className={styles.loading}>
                Loading cameras <AnimatedEllipsis />
            </div>
        );
    }
};

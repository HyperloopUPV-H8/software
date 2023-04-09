import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./CamerasPage.module.scss";
import { Cameras } from "pages/CamerasPage/Cameras/Cameras";
import { useWebRTC } from "hooks/WebRTC/useWebRTC";
import { AnimatedEllipsis } from "components/AnimatedEllipsis/AnimatedEllipsis";

export const CamerasPage = () => {
    const [cameras, setCameras] = useState<Array<CameraData>>([
        { index: 0, url: import.meta.env.VITE_CAMERA_1_URL },
        { index: 1, url: import.meta.env.VITE_CAMERA_1_URL },
        { index: 2, url: import.meta.env.VITE_CAMERA_1_URL },
    ]);

    if (streams) {
        return (
            <div className={styles.camerasPageWrapper}>
                <Cameras streams={streams} />
                <CamerasFooter />
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

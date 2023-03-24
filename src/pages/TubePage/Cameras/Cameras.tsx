import { CameraContainer } from "components/CameraContainer/CameraContainer";
import styles from "./Cameras.module.scss";

export const Cameras = () => {
    const signalUrl = import.meta.env.VITE_CAMERA_1_URL;

    return (
        <div className={styles.camerasWrapper}>
            <CameraContainer
                signalUrl={signalUrl}
                className={styles.camera}
            />
            <CameraContainer
                signalUrl={signalUrl}
                className={styles.camera}
            />
            <CameraContainer
                signalUrl={signalUrl}
                className={styles.camera}
            />
        </div>
    );
};

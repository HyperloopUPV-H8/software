import { CameraContainer } from "components/CameraContainer/CameraContainer";
import styles from "./Cameras.module.scss";

export const Cameras = () => {
    return (
        <div className={styles.camerasWrapper}>
            <CameraContainer className={styles.camera} />
            <CameraContainer className={styles.camera} />
            <CameraContainer className={styles.camera} />
        </div>
    );
};

import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./CamerasPage.module.scss";

export const CamerasPage = () => {
    return (
        <div className={styles.camerasContainer}>
            <div className={styles.camerasBody}>Cámaras</div>
            <div className={styles.cameraFooter}>
                <CamerasFooter />
            </div>
        </div>
    );
};

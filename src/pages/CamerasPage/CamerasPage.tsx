import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./CamerasPage.module.scss";

export const CamerasPage = () => {
    return (
        <div className={styles.camerasContainer}>
            <div className={styles.camerasBody}>
                <div className={styles.secondaryCameras}>
                    <div className={styles.title}>
                        <div>Cam 1</div>
                        <span className={styles.dot}></span>
                    </div>
                    <div className={styles.cam2}>Cam 2</div>
                    <div className={styles.cam3}>Cam 3</div>
                </div>
            </div>
            <CamerasFooter />
        </div>
    );
};

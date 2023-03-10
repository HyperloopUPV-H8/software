import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./SecondaryCameras.module.scss";

export const SecondaryCameras = () => {
    return (
        <div className={styles.secondaryCameras}>
            <div className={styles.gradientSecondaryCam}>
                <div className={styles.cam}>
                    <div className={styles.title}>
                        <div className={styles.name}>Cam 2</div>
                        <div className={styles.dot}></div>
                    </div>
                </div>
            </div>
            <div className={styles.gradientSecondaryCam}>
                <div className={styles.cam}>
                    <div className={styles.title}>
                        <div className={styles.name}>Cam 3</div>
                        <div className={styles.dot}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

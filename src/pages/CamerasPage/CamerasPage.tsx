import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./CamerasPage.module.scss";
import { SecondaryCameras } from "./SecondaryCameras";

export const CamerasPage = () => {
    return (
        <div className={styles.camerasContainer}>
            <div className={styles.camerasBody}>
                <div className={styles.mainCamera}></div>
                <div className={styles.overlayCameras}>
                    <div className={styles.title}>
                        <div className={styles.name}>Cam 1</div>
                        <div className={styles.dot}></div>
                    </div>
                    <SecondaryCameras />
                    {/* <div className={styles.secondaryCameras}>
                        <div className={styles.gradientSecondaryCam}>
                            <div className={styles.cam2}>
                                <div className={styles.title}>
                                    <div className={styles.name}>Cam 2</div>
                                    <div className={styles.dot}></div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.gradientSecondaryCam}>
                            <div className={styles.cam3}>
                                <div className={styles.title}>
                                    <div className={styles.name}>Cam 3</div>
                                    <div className={styles.dot}></div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            <CamerasFooter />
        </div>
    );
};

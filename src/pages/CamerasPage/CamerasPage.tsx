import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./CamerasPage.module.scss";
import { SecondaryCameras } from "./SecondaryCameras";
import { useWebRTC } from "hooks/useWebRTC";
import video1 from "./videoAuran.mp4";

export const CamerasPage = () => {
    const [state, ref] = useWebRTC("ws://127.0.0.1:4040/signal");
    return (
        <div className={styles.camerasContainer}>
            <div className={styles.camerasBody}>
                {/* <div className={styles.mainCamera}> */}
                <video
                    className={styles.mainCamera}
                    // ref={ref}
                    src={video1}
                    autoPlay
                    loop
                    muted
                />
                {/* <p>{state}</p> */}
                {/* </div> */}
                <div className={styles.overlayCameras}>
                    <div className={styles.title}>
                        <div className={styles.name}>Cam 1</div>
                        <div className={styles.dot}></div>
                    </div>
                    {/* <div className={styles.space}></div> */}
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
            {/* <div className={styles.footerWrapper}> */}
            <CamerasFooter />
            {/* </div> */}

            <video ref={ref} autoPlay loop muted />
            <p>{state}</p>
        </div>
    );
};

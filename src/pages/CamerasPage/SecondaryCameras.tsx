import { MouseEventHandler } from "react";
import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./SecondaryCameras.module.scss";

type camWithTitle = {
    video: string;
    title: string;
};

type Props = {
    videos: camWithTitle[];
    secondaryCameraClicked: (camClicked: number) => void;
};

export const SecondaryCameras = ({ videos, secondaryCameraClicked }: Props) => {
    return (
        <div className={styles.secondaryCameras}>
            <div className={styles.gradientSecondaryCam}>
                <div className={styles.cam}>
                    <video
                        className={styles.camera2}
                        // ref={ref}
                        src={videos[0].video}
                        autoPlay
                        loop
                        muted
                        onClick={() => {
                            secondaryCameraClicked(1);
                        }}
                    />
                    <div className={styles.overlayCam}>
                        <div className={styles.title}>
                            <div className={styles.name}>{videos[0].title}</div>
                            <div className={styles.dot}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.gradientSecondaryCam}>
                <div className={styles.cam}>
                    <video
                        className={styles.camera2}
                        // ref={ref}
                        src={videos[1].video}
                        autoPlay
                        loop
                        muted
                        onClick={() => secondaryCameraClicked(2)}
                    />
                    <div className={styles.overlayCam}>
                        <div className={styles.title}>
                            <div className={styles.name}>{videos[1].title}</div>
                            <div className={styles.dot}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

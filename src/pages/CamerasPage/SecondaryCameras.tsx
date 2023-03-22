import { MouseEventHandler } from "react";
import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./SecondaryCameras.module.scss";

type camWithTitle = {
    video: string;
    title: string;
};

type Props = {
    videos: camWithTitle[];
    onClick: (camClicked: number) => void;
};

export const SecondaryCameras = ({ videos, onClick }: Props) => {
    return (
        <div className={styles.secondaryCameras}>
            {videos.map((video, index) => {
                return (
                    <div className={styles.gradientSecondaryCam}>
                        <div className={styles.cam}>
                            <video
                                className={styles.camera2}
                                // ref={ref}
                                src={video.video}
                                autoPlay
                                loop
                                muted
                                disablePictureInPicture
                                onClick={() => {
                                    onClick(index + 1);
                                }}
                            />
                            <div className={styles.overlayCam}>
                                <div className={styles.title}>
                                    <div className={styles.name}>
                                        {video.title}
                                    </div>
                                    <div className={styles.dot}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* <div className={styles.gradientSecondaryCam}>
                <div className={styles.cam}>
                    <video
                        className={styles.camera2}
                        // ref={ref}
                        src={videos[0].video}
                        autoPlay
                        loop
                        muted
                        disablePictureInPicture
                        onClick={() => {
                            onClick(1);
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
                        disablePictureInPicture
                        onClick={() => onClick(2)}
                    />
                    <div className={styles.overlayCam}>
                        <div className={styles.title}>
                            <div className={styles.name}>{videos[1].title}</div>
                            <div className={styles.dot}></div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

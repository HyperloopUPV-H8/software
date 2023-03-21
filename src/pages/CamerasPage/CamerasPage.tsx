import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./CamerasPage.module.scss";
import { SecondaryCameras } from "./SecondaryCameras";
import { useWebRTC } from "hooks/WebRTC/useWebRTC";
import video1 from "./videoAuran.mp4";
import video2 from "./videoIgnis.mp4";
import video3 from "./videoTurian.mp4";
import { useState } from "react";

export const CamerasPage = () => {
    const [ref, state] = useWebRTC("ws://127.0.0.1:4040/signal");
    const [videos, setVideos] = useState([
        { video: video1, title: "Cam 1" },
        { video: video2, title: "Cam 2" },
        { video: video3, title: "Cam 3" },
    ]);

    function secondaryCameraClicked(camClicked: number): void {
        setVideos((prevVideos) => {
            const newVideos = [...prevVideos];
            let auxCamValue = newVideos[camClicked];
            newVideos[camClicked] = newVideos[0];
            newVideos[0] = auxCamValue;
            return newVideos;
        });

        console.log(videos);
    }

    return (
        <div className={styles.camerasContainer}>
            <div className={styles.camerasBody}>
                {/* <div className={styles.mainCamera}> */}
                <video
                    className={styles.mainCamera}
                    // ref={ref}
                    src={videos[0].video}
                    autoPlay
                    loop
                    muted
                />
                {/* <video
                    className={styles.mainCamera}
                    ref={ref}
                    autoPlay
                    loop
                    muted
                /> */}
                {/* <p>{state}</p> */}
                {/* </div> */}
                <div className={styles.overlayCameras}>
                    <div className={styles.title}>
                        <div className={styles.name}>{videos[0].title}</div>
                        <div className={styles.dot}></div>
                    </div>
                    {/* <div className={styles.space}></div> */}
                    <SecondaryCameras
                        videos={videos.slice(1, 3)}
                        secondaryCameraClicked={secondaryCameraClicked}
                    />
                </div>
            </div>
            <CamerasFooter />
        </div>
    );
};

import { TitleCamera } from "pages/CamerasPage/TitleCamera/TitleCam";
import styles from "./AuxCamera.module.scss";

type CameraData = {
    video: string;
    title: string;
};

type Props = {
    video: CameraData;
    index: number;
    onClick: (camClicked: number) => void;
};

export const AuxCamera = ({ video, index, onClick }: Props) => {
    return (
        <div className={styles.gradientSecondaryCam}>
            <div
                className={styles.cam}
                onClick={() => {
                    onClick(index + 1);
                }}
            >
                <video
                    className={styles.camera2}
                    // ref={ref} //TODO: ref of the hook for the streaming
                    src={video.video}
                    autoPlay
                    loop
                    muted
                    disablePictureInPicture //TODO: In firefox it is not fixed
                />
                <div className={styles.overlayCam}>
                    <TitleCamera title={video.title} />
                </div>
            </div>
        </div>
    );
};

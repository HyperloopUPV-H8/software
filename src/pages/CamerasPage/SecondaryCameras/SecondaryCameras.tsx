import { CameraData } from "../CameraData";
import { LabeledCamera } from "../LabeledCamera/LabeledCamera";
import styles from "./SecondaryCameras.module.scss";

type Props = {
    cameras: Array<CameraData>;
    onClick: (camClicked: number) => void;
    className?: string;
};

export const SecondaryCameras = ({
    cameras,
    onClick,
    className = "",
}: Props) => {
    return (
        <div className={`${styles.secondaryCamerasWrapper} ${className}`}>
            {cameras.map((camera, index) => {
                return (
                    <LabeledCamera
                        key={index}
                        className={styles.camera}
                        title={`Cam ${camera.index}`}
                        signalUrl={camera.url}
                        onClick={() => {
                            onClick(index + 1);
                        }}
                    />
                );
            })}
        </div>
    );
};

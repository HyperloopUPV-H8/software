import { LabeledCamera } from "../LabeledCamera/LabeledCamera";
import { CameraData } from "../useCameras";
import styles from "./SecondaryCameras.module.scss";

type Props = {
    cameras: Array<CameraData>;
    onClick: (index: number) => void;
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
                        camera={camera}
                        onClick={() => onClick(index + 1)}
                    />
                );
            })}
        </div>
    );
};

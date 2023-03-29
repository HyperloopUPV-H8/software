import { Camera } from "components/Camera/Camera";
import { CameraData } from "../useCameras";
import { CameraTitle } from "../CameraTitle/CameraTitle";
import styles from "./LabeledCamera.module.scss";

type Props = {
    camera: CameraData;
    onClick?: () => void;
    className?: string;
};

export const LabeledCamera = ({
    camera,
    onClick = () => {},
    className = "",
}: Props) => {
    return (
        <div className={`${styles.labeledCameraWrapper} ${className}`}>
            <Camera
                stream={camera.stream}
                className={styles.camera}
                onClick={() => onClick()}
            />
            <CameraTitle
                title={`Cam ${camera.id}`}
                className={styles.titleOverlay}
            />
        </div>
    );
};

import { Camera } from "../Camera/Camera";
import { CameraData } from "../../hooks/useCameras";
import styles from "./LabeledCamera.module.scss";
import { Label } from "./Label/Label";

type Props = {
    camera: CameraData;
    width?: string;
    height?: string;
    className?: string;
    onClick?: () => void;
};

export const LabeledCamera = ({
    camera,
    width = "",
    height = "",
    className = "",
    onClick = () => {},
}: Props) => {
    return (
        <div className={`${styles.labeledCameraWrapper} ${className}`}>
            <Camera
                style={{ width: width, height: height }}
                stream={camera.stream}
                className={styles.camera}
                onClick={() => onClick()}
            />
            <Label
                className={styles.label}
                label={`Cam ${camera.id}`}
            />
        </div>
    );
};

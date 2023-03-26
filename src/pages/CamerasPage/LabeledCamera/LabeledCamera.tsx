import { CameraContainer } from "components/CameraContainer/CameraContainer";
import { CameraTitle } from "../CameraTitle/CameraTitle";
import styles from "./LabeledCamera.module.scss";

type Props = {
    title: string;
    signalUrl: string;
    onClick?: () => void;
    className?: string;
};

export const LabeledCamera = ({
    title,
    signalUrl,
    onClick = () => {},
    className = "",
}: Props) => {
    return (
        <div className={`${styles.labeledCameraWrapper} ${className}`}>
            <CameraContainer
                className={styles.camera}
                signalUrl={signalUrl}
                onClick={() => {
                    onClick();
                }}
            />
            <CameraTitle
                title={title}
                className={styles.titleOverlay}
            />
        </div>
    );
};

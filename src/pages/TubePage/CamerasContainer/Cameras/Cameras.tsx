import { Camera } from "components/Camera/Camera";
import styles from "./Cameras.module.scss";

type Props = { streams: Array<MediaStream>; className: string };

export const Cameras = ({ streams, className }: Props) => {
    return (
        <div className={`${styles.camerasWrapper} ${className}`}>
            <Camera
                stream={streams[0]}
                className={styles.camera}
            />
            <Camera
                stream={streams[1]}
                className={styles.camera}
            />
            <Camera
                stream={streams[2]}
                className={styles.camera}
            />
        </div>
    );
};

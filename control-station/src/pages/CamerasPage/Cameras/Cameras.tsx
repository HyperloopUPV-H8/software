import styles from "./Cameras.module.scss";
import { LabeledCamera } from "pages/CamerasPage/LabeledCamera/LabeledCamera";
import { SecondaryCameras } from "pages/CamerasPage/SecondaryCameras/SecondaryCameras";
import { useCameras } from "pages/CamerasPage/useCameras";

type Props = {
    streams: Array<MediaStream>;
};

export const Cameras = ({ streams }: Props) => {
    const { cameras, setMainCamera } = useCameras(streams);
    return (
        <div className={styles.camerasWrapper}>
            <div className={styles.mainCameraWrapper}>
                <LabeledCamera
                    className={styles.mainCamera}
                    camera={cameras[0]}
                />
            </div>
            <SecondaryCameras
                cameras={cameras.slice(1)}
                onClick={(index: number) => setMainCamera(index)}
                className={styles.secondaryCameras}
            />
        </div>
    );
};

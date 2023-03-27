import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./CamerasPage.module.scss";
import { SecondaryCameras } from "./SecondaryCameras/SecondaryCameras";
import { useState, useCallback } from "react";
import { CameraTitle } from "./CameraTitle/CameraTitle";
import { CameraContainer } from "components/CameraContainer/CameraContainer";
import { CameraData } from "./CameraData";
import { LabeledCamera } from "./LabeledCamera/LabeledCamera";
export const CamerasPage = () => {
    const [cameras, setCameras] = useState<Array<CameraData>>([
        { index: 0, url: import.meta.env.VITE_CAMERA_1_URL },
        { index: 1, url: import.meta.env.VITE_CAMERA_1_URL },
        { index: 2, url: import.meta.env.VITE_CAMERA_1_URL },
    ]);

    const onClick = useCallback((camIndex: number): void => {
        setCameras((prevCameras) => {
            const newCameras = [...prevCameras];
            [newCameras[camIndex], newCameras[0]] = [
                newCameras[0],
                newCameras[camIndex],
            ];
            return newCameras;
        });
    }, []);

    return (
        <div className={styles.camerasPageWrapper}>
            <div className={styles.camerasBody}>
                <div className={styles.mainCameraWrapper}>
                    <LabeledCamera
                        title={`Cam ${cameras[0].index}`}
                        className={styles.mainCamera}
                        signalUrl={import.meta.env.VITE_CAMERA_1_URL}
                    />
                </div>
                <SecondaryCameras
                    cameras={cameras.slice(1)}
                    onClick={onClick}
                    className={styles.secondaryCameras}
                />
            </div>
            <CamerasFooter />
        </div>
    );
};

import { CamerasFooter } from "./Footer/CamerasFooter";
import styles from "./CamerasPage.module.scss";
import { SecondaryCameras } from "./SecondaryCameras/SecondaryCameras";
import { useState, useCallback } from "react";
import { CameraData } from "./CameraData";
import { LabeledCamera } from "./LabeledCamera/LabeledCamera";

export const CamerasPage = () => {
    const [cameras, setCameras] = useState<Array<CameraData>>([
        { id: "Cam 0", url: import.meta.env.VITE_CAMERA_1_URL as string },
        { id: "Cam 1", url: import.meta.env.VITE_CAMERA_1_URL as string },
        { id: "Cam 2", url: import.meta.env.VITE_CAMERA_1_URL as string },
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
                        title={cameras[0].id}
                        className={styles.mainCamera}
                        signalUrl={cameras[0].url}
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

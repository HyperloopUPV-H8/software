import styles from "./CamerasFooter.module.scss";
import { Information } from "./Information/Information";
import { Tube } from "./Tube/Tube";

export const CamerasFooter = () => {
    return (
        <div className={styles.cameraFooter}>
            <Information />
            <Tube />
        </div>
    );
};

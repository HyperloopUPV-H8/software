import styles from "./EmergencyOrders.module.scss";
import { EmergencyButton } from "./EmergencyButton/EmergencyButton";
import { ReactComponent as StopIcon } from "assets/svg/stop_icon.svg";
import { ReactComponent as RestartIcon } from "assets/svg/restart_icon.svg";
import { useListenKey } from "common";

type Props = {
    stopVehicle: () => void;
    restartVehicle: () => void;
    stopTube: () => void;
    restartTube: () => void;
};

export const EmergencyOrders = ({
    stopVehicle,
    restartVehicle,
    stopTube,
    restartTube,
}: Props) => {
    useListenKey("v", stopVehicle, true);
    useListenKey("V", stopVehicle, true);
    useListenKey("t", stopTube, true);
    useListenKey("T", stopTube, true);

    const StyledStopIcon = <StopIcon className={`${styles.icon}`} />;
    const StyledRestartIcon = (
        <RestartIcon
            className={`${styles.icon}`}
            color="#ebf6ff"
        />
    );
    return (
        <div className={styles.emergencyOrdersWrapper}>
            <EmergencyButton
                label={"VEHICLE"}
                icon={StyledStopIcon}
                className={styles.stopBtn}
                onClick={stopVehicle}
            />
            <EmergencyButton
                label={"VEHICLE"}
                icon={StyledRestartIcon}
                className={styles.restartBtn}
                onClick={() => {
                    restartVehicle;
                }}
            />
            <EmergencyButton
                label={"TUBE"}
                icon={StyledStopIcon}
                className={styles.stopBtn}
                onClick={() => {
                    stopTube;
                }}
            />
            <EmergencyButton
                label={"TUBE"}
                icon={StyledRestartIcon}
                className={styles.restartBtn}
                onClick={() => {
                    restartTube;
                }}
            />
        </div>
    );
};

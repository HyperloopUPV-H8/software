import styles from "./EmergencyOrders.module.scss";
import { EmergencyButton } from "./EmergencyButton/EmergencyButton";
import { ReactComponent as StopIcon } from "assets/svg/stop_icon.svg";
import { ReactComponent as RestartIcon } from "assets/svg/restart_icon.svg";
import { useSendOrder } from "hooks/useSendOrder";

const haltVehicleOrder = { id: 1, fields: {} };
const haltTubeOrder = { id: 2, fields: {} };
const restartVehicleOrder = { id: 3, fields: {} };
const restartTubeOrder = { id: 4, fields: {} };

export const EmergencyOrders = () => {
    const sendOrder = useSendOrder();

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
                onClick={() => {
                    sendOrder(haltVehicleOrder);
                }}
            />
            <EmergencyButton
                label={"VEHICLE"}
                icon={StyledRestartIcon}
                className={styles.restartBtn}
                onClick={() => {
                    sendOrder(restartVehicleOrder);
                }}
            />
            <EmergencyButton
                label={"TUBE"}
                icon={StyledStopIcon}
                className={styles.stopBtn}
                onClick={() => {
                    sendOrder(haltTubeOrder);
                }}
            />
            <EmergencyButton
                label={"TUBE"}
                icon={StyledRestartIcon}
                className={styles.restartBtn}
                onClick={() => {
                    sendOrder(restartTubeOrder);
                }}
            />
        </div>
    );
};

import styles from "./EmergencyOrders.module.scss";
import { EmergencyButton } from "./EmergencyButton/EmergencyButton";
import { ReactComponent as StopIcon } from "assets/svg/stop_icon.svg";
import { ReactComponent as RestartIcon } from "assets/svg/restart_icon.svg";

const faultColor = "hsl(9, 83%, 52%)";
const restartColor = "hsl(205, 83%, 52%)";

export const EmergencyOrders = () => {
    return (
        <div className={styles.emergencyOrdersWrapper}>
            <EmergencyButton
                label={"VEHICLE"}
                color={faultColor}
                icon={<StopIcon color={faultColor} />}
            />
            <EmergencyButton
                label={"VEHICLE"}
                color={restartColor}
                icon={<RestartIcon color={restartColor} />}
            />
            <EmergencyButton
                label={"TUBE"}
                color={faultColor}
                icon={<StopIcon color={faultColor} />}
            />
            <EmergencyButton
                label={"TUBE"}
                color={restartColor}
                icon={<RestartIcon color={restartColor} />}
            />
        </div>
    );
};

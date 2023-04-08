import styles from "./EmergencyOrders.module.scss";
import { EmergencyButton } from "./EmergencyButton/EmergencyButton";
import { ReactComponent as StopIcon } from "assets/svg/stop_icon.svg";
import { ReactComponent as RestartIcon } from "assets/svg/restart_icon.svg";
import { useSendOrder } from "hooks/useSendOrder";

const haltColor = "hsl(9, 83%, 52%)";
const restartColor = "hsl(205, 83%, 52%)";
const haltVehicleOrder = { id: 1, fields: {} };
const haltTubeOrder = { id: 2, fields: {} };
const restartVehicleOrder = { id: 3, fields: {} };
const restartTubeOrder = { id: 4, fields: {} };

export const EmergencyOrders = () => {
    const sendOrder = useSendOrder();

    return (
        <div className={styles.emergencyOrdersWrapper}>
            <EmergencyButton
                label={"VEHICLE"}
                color={haltColor}
                icon={<StopIcon color={haltColor} />}
                onClick={() => {
                    sendOrder(haltVehicleOrder);
                }}
            />
            <EmergencyButton
                label={"VEHICLE"}
                color={restartColor}
                icon={<RestartIcon color={restartColor} />}
                onClick={() => {
                    sendOrder(restartVehicleOrder);
                }}
            />
            <EmergencyButton
                label={"TUBE"}
                color={haltColor}
                icon={<StopIcon color={haltColor} />}
                onClick={() => {
                    sendOrder(haltTubeOrder);
                }}
            />
            <EmergencyButton
                label={"TUBE"}
                color={restartColor}
                icon={<RestartIcon color={restartColor} />}
                onClick={() => {
                    sendOrder(restartTubeOrder);
                }}
            />
        </div>
    );
};

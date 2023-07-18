import styles from "./EmergencyOrders.module.scss";
import { EmergencyButton } from "./EmergencyButton/EmergencyButton";
import { ReactComponent as StopIcon } from "assets/svg/stop_icon.svg";
import { ReactComponent as RestartIcon } from "assets/svg/restart_icon.svg";
import { ReactComponent as BrakeIcon } from "assets/svg/brake.svg";
import { ReactComponent as ContactorIcon } from "assets/svg/open_switch.svg";

type Props = {
    stop: () => void;
    reset: () => void;
    brake: () => void;
    openContactors: () => void;
};

export const EmergencyOrders = ({
    brake,
    openContactors,
    reset,
    stop,
}: Props) => {
    const StyledStopIcon = <StopIcon className={styles.icon} />;
    const StyledRestartIcon = (
        <RestartIcon
            className={`${styles.icon}`}
            color="#ebf6ff"
        />
    );

    const StyledBrakeIcon = <BrakeIcon className={styles.icon} />;
    const StyledOpenContactorIcon = (
        <ContactorIcon
            className={styles.icon}
            color="black"
        />
    );
    return (
        <div className={styles.emergencyOrdersWrapper}>
            <EmergencyButton
                label={"STOP"}
                icon={StyledStopIcon}
                className={styles.stopBtn}
                targetKey="s"
                onTrigger={stop}
            />
            <EmergencyButton
                label={"RESET"}
                icon={StyledRestartIcon}
                className={styles.restartBtn}
                targetKey="r"
                onTrigger={reset}
            />
            <EmergencyButton
                label={"BRAKE"}
                icon={StyledBrakeIcon}
                className={styles.brakeBtn}
                targetKey="b"
                onTrigger={brake}
            />
            <EmergencyButton
                label={"OPEN CONTACTORS"}
                icon={StyledOpenContactorIcon}
                className={styles.contactorBtn}
                targetKey="o"
                onTrigger={openContactors}
            />
        </div>
    );
};

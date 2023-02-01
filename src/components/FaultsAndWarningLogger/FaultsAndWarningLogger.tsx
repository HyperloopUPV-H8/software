import MessageLogger from "components/FaultsAndWarningLogger/MessageLogger/MessageLogger";

import styles from "components/FaultsAndWarningLogger/FaultsAndWarningLogger.module.scss";
import { useMessages } from "components/FaultsAndWarningLogger/useMessages";

const warningColor = { h: 41, s: 100, l: 40, a: 1 };
const faultColor = { h: 0, s: 100, l: 40, a: 1 };

export const FaultsAndWarningLogger = () => {
    const messages = useMessages();
    return (
        <div className={`${styles.containerMessages}`}>
            <MessageLogger
                title={"Warnings"}
                messages={messages.warning}
                color={warningColor}
            />
            <MessageLogger
                title={"Faults"}
                messages={messages.fault}
                color={faultColor}
            />
        </div>
    );
};

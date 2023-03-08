import styles from "./AlertMailbox.module.scss";
import { FaultMessageView } from "./FaultMessageView/FaultMessageView";
import { WarningMessageView } from "./WarningMessageView/WarningMessageView";
import { Window } from "components/Window/Window";
import { useAlertMessages } from "./useAlertMessages";
import { AlertMessageView } from "./AlertMessageView";

export const AlertMailbox = () => {
    const messages = useAlertMessages();
    return (
        <Window title="Alert Mailbox">
            <div className={styles.alertMailboxWrapper}>
                {[...messages].reverse().map((message, index) => {
                    return (
                        <AlertMessageView
                            key={index}
                            message={message}
                        />
                    );
                })}
            </div>
        </Window>
    );
};

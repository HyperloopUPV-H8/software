import MessageLogger from "components/FaultsAndWarningLogger/MessageLogger/MessageLogger";
import { useState } from "react";
import { store } from "../../store";
import styles from "components/FaultsAndWarningLogger/FaultsAndWarningLogger.module.scss";
import { useInterval } from "hooks/useInterval";
import { Message } from "models/Message";
const warningColor = { h: 41, s: 100, l: 40, a: 1 };
const faultColor = { h: 0, s: 100, l: 40, a: 1 };

export const FaultsAndWarningLogger = () => {
    const [messages, setMessages] = useState({
        fault: [] as Message[],
        warning: [] as Message[],
    });
    useInterval(() => {
        const state = store.getState();
        setMessages({
            fault: state.messages.fault,
            warning: state.messages.warning,
        });
    }, 1000 / 70);

    return (
        <div className={`${styles.containerMessages} island`}>
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

import ConsoleList from "@components/MessageLogger/ConsoleList/ConsoleList";
import { useState } from "react";
import { RootState } from "store";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import styles from "@components/MessageLogger/FaultsAndWarningList/FaultsAndWarningList.module.scss";
import { useInterval } from "@hooks/useInterval";
import { Message } from "@models/Message";
const warningColor = { h: 41, s: 100, l: 40, a: 1 };
const faultColor = { h: 0, s: 100, l: 40, a: 1 };

export const FaultsAndWarningList = () => {
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
        <div className={styles.containerMessages}>
            <ConsoleList
                title={"Warnings"}
                messages={messages.warning}
                color={warningColor}
            />
            <ConsoleList
                title={"Faults"}
                messages={messages.fault}
                color={faultColor}
            />
        </div>
    );
};

import styles from "./MessagesContainer.module.scss";
import { Messages } from "./Messages/Messages";
import { useMessages } from "components/MessagesContainer/useMessages";
import { Window } from "components/Window/Window";
import { Message } from "common";

const messages: Message[] = [
    {
        id: "1",
        board: "LCU_MASTER",
        count: 10,
        kind: "fault",
        name: "Sergio",
        timestamp: {
            counter: 10,
            day: 12,
            hour: 12,
            minute: 12,
            month: 12,
            second: 12,
            year: 12,
        },
        protection: {
            kind: "OUT_OF_BOUNDS",
            data: { bounds: [10, 20], value: 10 },
        },
    },
    {
        id: "1",
        board: "LCU_MASTER",
        count: 10,
        kind: "fault",
        name: "Sergio",
        timestamp: {
            counter: 10,
            day: 12,
            hour: 12,
            minute: 12,
            month: 12,
            second: 12,
            year: 12,
        },
        protection: {
            kind: "OUT_OF_BOUNDS",
            data: { bounds: [10, 20], value: 10 },
        },
    },
    {
        id: "1",
        board: "LCU_MASTER",
        count: 10,
        kind: "fault",
        name: "Sergio",
        timestamp: {
            counter: 10,
            day: 12,
            hour: 12,
            minute: 12,
            month: 12,
            second: 12,
            year: 12,
        },
        protection: {
            kind: "OUT_OF_BOUNDS",
            data: { bounds: [10, 20], value: 10 },
        },
    },
];

export const MessagesContainer = () => {
    // const messages = useMessages();

    return (
        <Window
            title="Messages"
            height="fill"
        >
            {messages.length > 0 && <Messages messages={messages} />}
            {messages.length == 0 && (
                <div className={styles.emptyAlert}>
                    Messages will be displayed here
                </div>
            )}
        </Window>
    );
};

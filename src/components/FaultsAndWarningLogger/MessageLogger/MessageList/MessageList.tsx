import MessageItem from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageItem/MessageItem";
import styles from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageList.module.scss";
import { Message } from "@models/Message";
import { HSLAColor } from "@utils/color";
import { useEffect, useRef, useState } from "react";
import { useWheelScroll } from "./useWheelScroll";

interface Props {
    messages: Message[];
    color: HSLAColor;
}
const MESSAGES_INITIALLY_SHOWN = 10;

export const MessageList = ({ messages, color }: Props) => {
    const scrollUlRef = useRef<HTMLUListElement>(null);
    const isBottomLocked = useRef(true);
    const handleWheel = useWheelScroll(scrollUlRef, messages, isBottomLocked);
    const [messagesShown, setmessagesShown] = useState(
        MESSAGES_INITIALLY_SHOWN
    );
    const firstMsgShown = useRef(0);

    function handleButtonClick() {
        setmessagesShown(messagesShown + MESSAGES_INITIALLY_SHOWN);
        firstMsgShown.current -= MESSAGES_INITIALLY_SHOWN;
    }

    useEffect(() => {
        if (isBottomLocked.current) {
            firstMsgShown.current = messages.length - messagesShown;
        }
    }, [messages]);

    return (
        <ul
            className={styles.messagesList}
            onWheel={handleWheel}
            ref={scrollUlRef}
        >
            {messages.length > messagesShown ? (
                <button className={styles.button} onClick={handleButtonClick}>
                    More msgs
                </button>
            ) : null}
            {messages.map((message, index) => {
                if (index >= firstMsgShown.current) {
                    return (
                        <MessageItem
                            key={message.listId}
                            message={message}
                            color={color}
                        />
                    );
                }
            })}
        </ul>
    );
};

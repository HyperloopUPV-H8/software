import MessageItem from "@components/MessageLogger/MessageItem/MessageItem";
import styles from "@components/MessageLogger/MessageList/MessageList.module.scss";
import { Message } from "@models/Message";
import { HSLColor } from "@utils/color";

interface Props {
    messages: Message[];
    color: HSLColor;
}

export const MessageList = ({ messages, color }: Props) => {
    return (
        <ul className={styles.messagesList}>
            {messages.map((message) => {
                return (
                    <MessageItem
                        key={message.listId}
                        message={message}
                        color={color}
                    />
                );
            })}
        </ul>
    );
};

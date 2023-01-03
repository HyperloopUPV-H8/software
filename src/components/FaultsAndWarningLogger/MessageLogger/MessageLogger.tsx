import { memo } from "react";
import { MessageList } from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageList";
import { Message } from "@models/Message";
import { HSLAColor } from "@utils/color";
import styles from "@components/FaultsAndWarningLogger/MessageLogger/MessageLogger.module.scss";
interface Props {
    title: string;
    messages: Message[];
    color: HSLAColor;
}

const MessageLogger = ({ title, messages, color }: Props) => {
    return (
        <div className={styles.messageLogger}>
            <div className={styles.title}>{title}</div>
            <MessageList messages={messages} color={color} />
        </div>
    );
};

export default memo(MessageLogger);

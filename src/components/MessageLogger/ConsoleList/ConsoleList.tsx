import { memo } from "react";
import { MessageList } from "@components/MessageLogger/MessageList/MessageList";
import { Message } from "@models/Message";
import { MessageCounter } from "@adapters/Message";
import { nanoid } from "nanoid";
import styles from "@components/MessageLogger/ConsoleList/ConsoleList.module.scss";
import { HSLAColor } from "@utils/color";
interface Props {
    title: string;
    messages: Message[];
    color: HSLAColor;
}

function getMessagesWithCount(messages: Message[]): MessageCounter[] {
    let messagesWithCount: MessageCounter[] = [];
    let currentIndex = 0;
    let currentId: number | undefined;

    for (let message of messages) {
        if (typeof currentId === "undefined") {
            currentId = message.id;
            messagesWithCount.push({
                id: message.listId,
                count: 1,
                msg: message,
            });
        } else {
            if (message.id == currentId) {
                messagesWithCount[currentIndex].count++;
                messagesWithCount[currentIndex].id = message.listId;
            } else {
                currentId = message.id;
                messagesWithCount.push({
                    id: message.listId,
                    count: 1,
                    msg: message,
                });
                currentIndex++;
            }
        }
    }
    return messagesWithCount;
}

const ConsoleList = ({ title, messages, color }: Props) => {
    //let messagesWithCount = getMessagesWithCount(messages);
    return (
        <div className={styles.containerMessages}>
            <div className={styles.title}>{title}</div>
            <MessageList messages={messages} color={color} />
        </div>
    );
};

export default memo(ConsoleList);

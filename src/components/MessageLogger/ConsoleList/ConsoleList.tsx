import { useEffect, useRef, memo } from "react";
import { MessageList } from "@components/MessageLogger/MessageList/MessageList";
import { Message, MessageCounter } from "@adapters/Message";
import { nanoid } from "nanoid";
import styles from "@components/MessageLogger/ConsoleList/ConsoleList.module.scss";
import { HSLColor } from "@utils/color";

interface Props {
  title: string;
  messages: Message[];
  color: HSLColor;
}

function getMessagesWithCount(messages: Message[]): MessageCounter[] {
  let messagesWithCount: MessageCounter[] = [];
  let currentId: number | undefined;
  let currentMessageCounter: MessageCounter;

  messages.forEach((message) => {
    if (typeof currentId === "undefined") {
      currentId = message.id;
      currentMessageCounter = { id: nanoid(), count: 1, msg: message };
    } else {
      if (message.id == currentId) {
        currentMessageCounter.count++;
      } else {
        messagesWithCount.push(currentMessageCounter);
        currentId = message.id;
        currentMessageCounter = { id: nanoid(), count: 1, msg: message };
      }
    }
  });

  return messagesWithCount;
}

const ConsoleList = ({ title, messages, color }: Props) => {
  let messagesWithCount = getMessagesWithCount(messages);

  return (
    <div className={styles.containerMessages}>
      <div className={styles.title}>{title}</div>
      <MessageList messages={messagesWithCount} color={color} />
    </div>
  );
};

export default memo(ConsoleList);

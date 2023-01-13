import MessageItem from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageItem/MessageItem";
import styles from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageList.module.scss";
import { useSpecialScroll } from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/useSpecialScroll";
import { Message } from "@models/Message";
import { HSLAColor } from "@utils/color";
import { useEffect, useRef } from "react";

interface Props {
  messages: Message[];
  color: HSLAColor;
}

export const MessageList = ({ messages, color }: Props) => {
  const scrollUlRef = useRef<HTMLUListElement>(null);
  const [handleScroll] = useSpecialScroll(scrollUlRef, messages);

  return (
    <ul
      className={styles.messagesList}
      onScroll={handleScroll}
      ref={scrollUlRef}
    >
      {messages.map((message) => {
        return (
          <MessageItem key={message.listId} message={message} color={color} />
        );
      })}
    </ul>
  );
};

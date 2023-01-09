import MessageItem from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageItem/MessageItem";
import styles from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageList.module.scss";
import { Message } from "@models/Message";
import { HSLAColor } from "@utils/color";
import { useEffect, useRef } from "react";

interface Props {
  messages: Message[];
  color: HSLAColor;
}

export const MessageList = ({ messages, color }: Props) => {
  const isBottomLocked = useRef(true);
  const emptyDivRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    isBottomLocked.current = !isBottomLocked.current;
    console.log(isBottomLocked);
  }

  function scrollToBottom() {
    emptyDivRef.current!.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (isBottomLocked.current) {
      scrollToBottom();
    }
  });

  return (
    <ul className={styles.messagesList}>
      {messages.map((message) => {
        return (
          <MessageItem
            key={message.listId}
            message={message}
            color={color}
            onHandleScroll={handleScroll}
          />
        );
      })}
      <div className={styles.endDiv} ref={emptyDivRef} />
    </ul>
  );
};

import MessageItem from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageItem/MessageItem";
import styles from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageList.module.scss";
import { useSpecialScroll } from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/useSpecialScroll";
import { Message } from "@models/Message";
import { HSLAColor } from "@utils/color";
import { useEffect, useRef, useState } from "react";

interface Props {
  messages: Message[];
  color: HSLAColor;
}
const MESSAGES_INITIALLY_SHOWN = 10;

export const MessageList = ({ messages, color }: Props) => {
  const scrollUlRef = useRef<HTMLUListElement>(null);
  const [handleScroll] = useSpecialScroll(scrollUlRef, messages);
  const [messagesShown, setmessagesShown] = useState(MESSAGES_INITIALLY_SHOWN);

  function handleButtonClick2() {
    setmessagesShown(messagesShown + MESSAGES_INITIALLY_SHOWN);
  }

  return (
    <ul
      className={styles.messagesList}
      onScroll={handleScroll}
      ref={scrollUlRef}
    >
      {/* //FIXME: Scroll to the beggining to charge older messages */}
      <button
        className={styles.button}
        onClick={handleButtonClick2}
        style={{
          visibility: messages.length > messagesShown ? "visible" : "hidden",
        }}
      >
        More msgs
      </button>
      {messages.map((message, index) => {
        if (index >= messages.length - messagesShown) {
          return (
            <MessageItem key={message.listId} message={message} color={color} />
          );
        }
      })}
    </ul>
  );
};

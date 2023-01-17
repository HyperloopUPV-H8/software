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
  //FIXME: Change ref to useState to render when click the button
  const messagesShown = useRef(MESSAGES_INITIALLY_SHOWN);
  const [messagesShown2, setmessagesShown2] = useState(
    MESSAGES_INITIALLY_SHOWN
  );
  //let messagesShown = MESSAGES_INITIALLY_SHOWN;
  function handleButtonClick() {
    messagesShown.current += MESSAGES_INITIALLY_SHOWN;
    console.log(messagesShown);
  }

  function handleButtonClick2() {
    setmessagesShown2(messagesShown2 + MESSAGES_INITIALLY_SHOWN);
    console.log(messagesShown2);
  }

  return (
    <ul
      className={styles.messagesList}
      onScroll={handleScroll}
      ref={scrollUlRef}
    >
      {/* //FIXME: Scroll to the beggining to charge older messages */}
      {/* //FIXME: If the number of messages is lower than the messagesShown, button dissapears */}
      <button
        className={styles.button}
        onClick={handleButtonClick2}
        style={{
          visibility:
            messages.length > messagesShown.current ? "visible" : "hidden",
        }}
      >
        More msgs
      </button>
      {messages.map((message, index) => {
        if (index >= messages.length - messagesShown2) {
          //messagesShown.current
          return (
            <MessageItem key={message.listId} message={message} color={color} />
          );
        }
      })}
    </ul>
  );
};

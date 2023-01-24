import MessageItem from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageItem/MessageItem";
import styles from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageList.module.scss";
import { useSpecialScroll } from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/useSpecialScroll";
import { Message } from "@models/Message";
import { HSLAColor } from "@utils/color";
import { WheelEvent } from "react";
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
  const [handleScroll] = useSpecialScroll(
    scrollUlRef,
    messages,
    isBottomLocked
  );
  const [handleWheel] = useWheelScroll(scrollUlRef, messages, isBottomLocked);
  const [messagesShown, setmessagesShown] = useState(MESSAGES_INITIALLY_SHOWN);

  function handleButtonClick() {
    setmessagesShown(messagesShown + MESSAGES_INITIALLY_SHOWN);
  }

  // function handleWheel2(ev: WheelEvent) {
  //   handleWheel(ev);
  // }

  // function scrollToBottom() {
  //   scrollUlRef.current?.scrollTo({
  //     top: scrollUlRef.current.scrollHeight,
  //     behavior: "smooth",
  //   });
  // }

  // useEffect(() => {
  //   if (isBottomLocked.current) {
  //     scrollToBottom();
  //   }
  // }, [messages]);

  // function handleWheel(ev: WheelEvent) {
  //   if (ev.deltaY > 0) {
  //     console.log("scroll down");
  //     console.log(ev.deltaY);
  //     isBottomLocked.current = true;
  //   } else {
  //     console.log("scroll up");
  //     console.log(ev.deltaY);
  //     isBottomLocked.current = false;
  //   }
  //   const bottom =
  //     scrollUlRef.current?.scrollHeight - scrollUlRef.current?.scrollTop ===
  //     scrollUlRef.current?.clientHeight;
  // }

  // function handleWheel(ev: WheelEvent) {
  //   const bottom =
  //     scrollUlRef.current!.scrollHeight - scrollUlRef.current!.scrollTop ===
  //     scrollUlRef.current?.clientHeight;

  //   if (isBottomLocked.current) {
  //     console.log(scrollUlRef.current!.scrollTop);
  //     //FIXME: When there is a duplicate message, an autoscroll occurs. Before the limitation of messages it didn't happened
  //     if (ev.deltaY < 0) {
  //       isBottomLocked.current = false;
  //       console.log("scroll up");
  //       console.log(ev.deltaY);
  //     }
  //   } else if (bottom && !isBottomLocked.current) {
  //     isBottomLocked.current = true;
  //   }
  // }

  // function scrollToBottom() {
  //   scrollUlRef.current?.scrollTo({
  //     top: scrollUlRef.current.scrollHeight,
  //     behavior: "smooth",
  //   });
  // }

  // useEffect(() => {
  //   if (isBottomLocked.current) {
  //     scrollToBottom();
  //   }
  // }, [messages]);

  return (
    <ul
      className={styles.messagesList}
      //onScroll={handleScroll}
      //onWheel={handleScroll}
      onWheel={handleWheel}
      ref={scrollUlRef}
    >
      {/* //FIXME: Scroll to the beggining to charge older messages */}
      {messages.length > messagesShown ? (
        <button className={styles.button} onClick={handleButtonClick}>
          More msgs
        </button>
      ) : null}
      {messages.map((message, index) => {
        if (
          //!isBottomLocked.current || //comprobar si es correcto
          index >=
          messages.length - messagesShown
        ) {
          return (
            <MessageItem key={message.listId} message={message} color={color} />
          );
        }
      })}
    </ul>
  );
};

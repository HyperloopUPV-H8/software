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

  //esto puede sobrar, si funciona el método de abajo
  function handleScroll() {
    isBottomLocked.current = !isBottomLocked.current;
    console.log(isBottomLocked);
  }

  //error: cuando está al final, al salir un nuevo mensaje, a veces se vuelve a poner en modo lectura
  //detectar cuando sube, ver si es eficiente
  function handleScrollRead(e: React.UIEvent<HTMLElement>) {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      console.log("bottom");
    }

    if (!bottom && isBottomLocked.current) {
      isBottomLocked.current = false;
      console.log("Read" + isBottomLocked);
    } else if (bottom && !isBottomLocked.current) {
      isBottomLocked.current = true;
      console.log("End" + isBottomLocked);
    }
  }

  function handleScrollEnd() {
    if (isBottomLocked.current) {
      isBottomLocked.current = true;
      console.log("End" + isBottomLocked);
    }
  }

  function scrollToBottom() {
    emptyDivRef.current!.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (isBottomLocked.current) {
      scrollToBottom();
    }
    console.log("Se ejecuta");
  }, [isBottomLocked.current]); //comprobar que se ejecuta cuando corresponde

  return (
    <ul className={styles.messagesList} onScroll={handleScrollRead}>
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

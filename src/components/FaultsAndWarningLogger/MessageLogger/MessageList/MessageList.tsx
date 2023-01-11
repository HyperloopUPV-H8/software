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
  const scrollUlRef = useRef<HTMLUListElement>(null);
  const scrollY = useRef(0);

  //esto puede sobrar, si funciona el método de abajo
  function handleScroll() {
    isBottomLocked.current = !isBottomLocked.current;
    console.log(isBottomLocked);
  }

  //error: cuando está al final, al salir un nuevo mensaje, a veces se vuelve a poner en modo lectura
  //detectar cuando sube, ver si es eficiente
  //CUidado con todas las ! que estoy poniendo, asegurarse
  function handleScrollRead(ev: React.UIEvent<HTMLElement>) {
    // Hacer Custom hook para esta funcionalidad [propiedadquenecesito, handleScroll] = useSpecialScroll(messages)
    const bottom =
      ev.currentTarget.scrollHeight - ev.currentTarget.scrollTop ===
      ev.currentTarget.clientHeight;

    ev.currentTarget;
    if (!bottom && isBottomLocked.current) {
      //igual se puede quitar el bottom aquí
      if (scrollY.current > scrollUlRef.current!.scrollTop) {
        console.log("scroll up");
        isBottomLocked.current = false;
      }
    } else if (bottom && !isBottomLocked.current) {
      isBottomLocked.current = true;
    }
  }

  function scrollToBottom() {
    scrollUlRef.current?.scrollTo({
      top: scrollUlRef.current.scrollHeight,
      behavior: "smooth",
    });

    scrollY.current = scrollUlRef.current!.scrollTop;
  }

  useEffect(() => {
    if (isBottomLocked.current) {
      scrollToBottom();
    }
    console.log("Se ejecuta");
  }, [messages]); //comprobar que se ejecuta cuando corresponde

  return (
    <ul
      className={styles.messagesList}
      onScroll={handleScrollRead}
      ref={scrollUlRef}
    >
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
    </ul>
  );
};

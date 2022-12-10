import React, { useEffect, useState } from "react";
import { MessageList } from "@components/MessageLogger/MessageList";
import { Message, MessageCounter } from "@adapters/Message";
import { nanoid } from "nanoid";
import styles from "@components/MessageLogger/ConsoleList.module.scss";

interface Props {
  title: string;
  messages: Message[];
}

export const ConsoleList = ({ title, messages }: Props) => {
  const [messagesCounter, setMessagesCounter] = useState(
    [] as MessageCounter[]
  );

  useEffect(() => {
    messagesWithCounts();
  }, []);

  const messagesWithCounts = (): void => {
    let msgCounts: MessageCounter[] = [];

    for (let i = 0; i < messages.length; i++) {
      let el = messages[i];
      let count = defineCount(el, i);
      msgCounts.push({ id: nanoid(), msg: messages[i], count: count });
      i += checkIndex(count);
    }
    setMessagesCounter([...msgCounts]);
  };

  const defineCount = (el: Message, i: number): number => {
    let count = 1;
    if (i < messages.length - 1) {
      count = checkMsgRepeated(el.id, i + 1);
    } else {
      //if it is in the last element it is because is alone
      count = 1;
    }
    return count;
  };

  const checkMsgRepeated = (id: number, index: number): number => {
    let count: number = 1;
    let finished: boolean = false;

    while (!finished && index < messages.length) {
      if (id === messages[index].id) {
        count++;
      } else {
        finished = true;
      }
      index++;
    }
    return count;
  };

  const checkIndex = (count: number): number => {
    let i = 0;
    if (count > 1) {
      //several elements mustn't be counted because they are repeated
      i += count - 1;
    }
    return i;
  };

  return (
    <div className={styles.containerMessages}>
      <div className={styles.titleConnections}>{title}</div>
      <MessageList
        messages={messagesCounter}
        color={
          messagesCounter.length <= 0
            ? { h: 0, s: 100, l: 40 }
            : messagesCounter[0].msg.type === "warning"
            ? { h: 41, s: 100, l: 40 }
            : { h: 0, s: 100, l: 40 }
        }
      />
    </div>
  );
};

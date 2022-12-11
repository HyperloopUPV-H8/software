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

  // for (let i = 0; i < messages.length; i++) {
  //   let el = messages[i];
  //   let count = defineCount(el, i);
  //   msgCounts.push({ id: nanoid(), msg: messages[i], count: count });
  //   i += checkIndex(count);
  // }
  // setMessagesCounter([...msgCounts]);
}

const ConsoleList = ({ title, messages, color }: Props) => {
  let messagesWithCount = getMessagesWithCount(messages);

  // const defineCount = (el: Message, i: number): number => {
  //   let count = 1;
  //   if (i < messages.length - 1) {
  //     count = checkMsgRepeated(el.id, i + 1);
  //   } else {
  //     //if it is in the last element it is because is alone
  //     count = 1;
  //   }
  //   return count;
  // };

  // const checkMsgRepeated = (id: number, index: number): number => {
  //   let count: number = 1;
  //   let finished: boolean = false;

  //   while (!finished && index < messages.length) {
  //     if (id === messages[index].id) {
  //       count++;
  //     } else {
  //       finished = true;
  //     }
  //     index++;
  //   }
  //   return count;
  // };

  // const checkIndex = (count: number): number => {
  //   let i = 0;
  //   if (count > 1) {
  //     //several elements mustn't be counted because they are repeated
  //     i += count - 1;
  //   }
  //   return i;
  // };

  return (
    <div className={styles.containerMessages}>
      <div className={styles.title}>{title}</div>
      <MessageList messages={messagesWithCount} color={color} />
    </div>
  );
};

export default memo(ConsoleList);

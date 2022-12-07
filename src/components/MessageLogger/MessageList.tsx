import React, { useEffect, useState } from "react";
import { LineMessage } from "@components/MessageLogger/LineMessage";
import styles from "@components/MessageLogger/MessageList.module.scss";
import { MessageCounter } from "@adapters/Message";

interface Props {
  messages: MessageCounter[];
}

export const MessageList = ({ messages }: Props) => {
  return (
    <div id={styles.containerMessages}>
      <ul className={styles.lineMsgUl}>
        {messages.map((item, index) => {
          return (
            <LineMessage key={item.id} message={item.msg} count={item.count} />
          );
        })}
      </ul>
    </div>
  );
};

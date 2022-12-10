import React, { useEffect, useState } from "react";
import { LineMessage } from "@components/MessageLogger/LineMessage";
import styles from "@components/MessageLogger/MessageList.module.scss";
import { MessageCounter } from "@adapters/Message";
import { HSLColor, hslToHex } from "@utils/color";

interface Props {
  messages: MessageCounter[];
  color: HSLColor;
}

export const MessageList = ({ messages, color }: Props) => {
  return (
    <div id={styles.listWrapper}>
      <ul className={styles.lineMsgUl}>
        {messages.map((item, index) => {
          return (
            <LineMessage
              key={item.id}
              message={item.msg}
              count={item.count}
              color={color}
            />
          );
        })}
      </ul>
    </div>
  );
};

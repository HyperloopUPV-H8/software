import React, { useEffect, useState } from "react";
import { LineMessage } from "@components/MessageLogger/LineMessage";
import styles from "@components/MessageLogger/MessageList.module.scss";
import { MessageCounter } from "@adapters/Message";
import { HSLColor, hslToHex } from "@utils/color";

interface Props {
  messages: MessageCounter[];
}

export const MessageList = ({ messages }: Props) => {
  return (
    <div id={styles.listWrapper}>
      <ul className={styles.lineMsgUl}>
        {messages.map((item, index) => {
          return (
            <LineMessage
              key={item.id}
              message={item.msg}
              count={item.count}
              color={
                item.msg.type === "warning"
                  ? { h: 41, s: 100, l: 40 }
                  : { h: 0, s: 100, l: 40 }
              }
              //  "#ce980e" : "#c51010"}"
              // colorBackground={
              //   item.msg.type === "warning" ? "#f3e4ad" : "#fec8c8"
              // }
            />
          );
        })}
      </ul>
    </div>
  );
};

import React, { useState } from "react";
import styles from "@components/MessageLogger/LineMessage.module.scss";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { Message } from "@adapters/Message";

interface Props {
  message: Message;
  count: number;
}

export const LineMessage = ({ message, count }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropDownLine = () => {
    setIsOpen((current) => !current);
  };

  return (
    <>
      <li
        className={styles.lineMsg}
        key={message.id}
        style={{
          whiteSpace: isOpen ? "normal" : "nowrap",
        }}
      >
        <IoIosArrowDropdownCircle
          id={styles.dropDownArrowIcon}
          onClick={dropDownLine}
          style={{
            transform: isOpen ? "none" : "rotate(270deg)",
          }}
        />
        <label id={styles.idMsg}>{message.id}: </label>
        {count > 1 ? <label id={styles.count}>{count}</label> : null}
        <label id={styles.descMsg}>{message.description}</label>
        <br />
      </li>
      <hr className={styles.hr} />
    </>
  );
};

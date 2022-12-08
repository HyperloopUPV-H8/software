import React, { useEffect, useRef, useState } from "react";
import styles from "@components/MessageLogger/LineMessage.module.scss";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { BsFillCaretRightFill } from "react-icons/bs";
import { Message } from "@adapters/Message";

interface Props {
  message: Message;
  count: number;
}

export const LineMessage = ({ message, count }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(true);
  const [changeWidth, setChangeWidth] = useState(true);
  let descRef = useRef(null);

  const dropDownLine = () => {
    setIsOpen((current) => !current);
  };

  function checkOverflow(el: HTMLElement) {
    var overflowing = el.clientWidth < el.scrollWidth;

    return overflowing;
  }

  const changeOverflowState = (overflow: boolean) => {
    setIsOverflowing((_) => overflow);
  };

  useEffect(() => {
    const observer = new ResizeObserver((_) => {
      setChangeWidth((current) => !current);
    });
    const descElement = descRef.current!;
    const overflow = checkOverflow(descElement);
    changeOverflowState(overflow);

    observer.observe(descElement);
    return () => {
      descRef.current && observer.unobserve(descRef.current);
    };
  }, [changeWidth]); //comprobar cuando hacer el useEffect

  return (
    <>
      <li
        className={styles.lineMsg}
        key={message.id}
        style={{
          whiteSpace: isOpen ? "normal" : "nowrap",
        }}
      >
        <BsFillCaretRightFill
          id={styles.dropDownArrowIcon}
          onClick={dropDownLine}
          style={{
            transform: isOpen ? "rotate(90deg)" : "none",
            visibility: !isOverflowing ? "hidden" : "visible",
          }}
        />
        <label
          id={styles.idMsg}
          style={{
            color: message.type === "warning" ? "#ce980e" : "#c51010",
          }}
        >
          {message.id}:{" "}
        </label>
        {count > 1 ? <label id={styles.count}>{count}</label> : null}
        <label
          id={styles.descMsg}
          style={{
            color: message.type === "warning" ? "#ce980e" : "#c51010",
          }}
          ref={descRef}
        >
          {message.description}
        </label>
        <br />
      </li>
      <hr
        className={styles.hr}
        style={{
          color: message.type === "warning" ? "#ce980e" : "#c51010",
        }}
      />
    </>
  );
};

import React, { useEffect, useRef, useState } from "react";
import styles from "@components/MessageLogger/LineMessage.module.scss";
import { BsFillCaretRightFill } from "react-icons/bs";
import { Message } from "@adapters/Message";
import { Counter } from "@components/MessageLogger/Counter";

interface Props {
  message: Message;
  count: number;
  color: string;
  colorBackground: string;
}

export const LineMessage = ({
  message,
  count,
  color,
  colorBackground,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(true);
  const [changeWidth, setChangeWidth] = useState(true);
  let descRef = useRef(null);

  const dropDownLine = () => {
    setIsOpen((current) => !current);
  };

  function checkOverflow(el: HTMLElement) {
    let overflowing = el.clientWidth < el.scrollWidth;

    return overflowing;
  }

  const changeOverflowState = (overflow: boolean) => {
    setIsOverflowing(overflow);
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
  }, [changeWidth]);

  return (
    <div style={{ backgroundColor: colorBackground }}>
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
        <label id={styles.idMsg} style={{ color: color }}>
          {message.id}:{" "}
        </label>
        <Counter count={count} />
        <label id={styles.descMsg} style={{ color: color }} ref={descRef}>
          {message.description}
        </label>
        <br />
      </li>
      <hr className={styles.hr} style={{ color: color }} />
    </div>
  );
};

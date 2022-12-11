import React, { useEffect, useRef, useState } from "react";
import styles from "@components/MessageLogger/LineMessage/LineMessage.module.scss";
import { BsFillCaretRightFill } from "react-icons/bs";
import { Message } from "@adapters/Message";
import { Counter } from "@components/MessageLogger/Counter/Counter";
import { getSofterHSLColor, HSLColor, hslColorToString } from "@utils/color";
import { Caret } from "@components/Caret/Caret";
interface Props {
  message: Message;
  count: number;
  color: HSLColor;
}

export const LineMessage = ({ message, count, color }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(true);
  const [changeWidth, setChangeWidth] = useState(true);
  let descRef = useRef(null);

  function checkOverflow(el: HTMLElement) {
    let overflowing = el.clientWidth < el.scrollWidth;
    return overflowing;
  }

  function changeOverflowState(overflow: boolean) {
    setIsOverflowing(overflow);
  }

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
    <li
      className={styles.lineMsg}
      key={message.id}
      style={{
        whiteSpace: isOpen ? "normal" : "nowrap",
        backgroundColor: hslColorToString(getSofterHSLColor(color, 48)),
      }}
    >
      {isOverflowing && (
        <Caret
          className={styles.caret}
          isOpen={isOpen}
          onClick={() => {
            setIsOpen((current) => !current);
          }}
        />
      )}

      <div className={styles.idMsg} style={{ color: hslColorToString(color) }}>
        {message.id}:
      </div>
      <div
        className={styles.description}
        style={{ color: hslColorToString(color) }}
        ref={descRef}
      >
        {message.description}
      </div>
      {count > 1 && <Counter className={styles.counter} count={count} />}
    </li>
  );
};

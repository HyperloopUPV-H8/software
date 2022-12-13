import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "@components/MessageLogger/MessageItem/MessageItem.module.scss";
import { Message } from "@adapters/Message";
import { Counter } from "@components/MessageLogger/Counter/Counter";
import { getSofterHSLColor, HSLColor, hslColorToString } from "@utils/color";
import { Caret } from "@components/Caret/Caret";
interface Props {
  message: Message;
  count: number;
  color: HSLColor;
}

export const MessageItem = ({ message, count, color }: Props) => {
  const [isOverflowing, setIsOverflowing] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const resizeObserver = useRef(
    new ResizeObserver((entries) => {
      let descriptionElement = entries[0].target as HTMLElement;
      setIsOverflowing(checkOverflow(descriptionElement));
    })
  );

  const wrapperRef = useRef<HTMLLIElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  function checkOverflow(el: HTMLElement) {
    el.style.whiteSpace = "nowrap";
    let overflowing = el.clientWidth < el.scrollWidth;
    el.style.whiteSpace = "";

    return overflowing;
  }

  useLayoutEffect(() => {
    setIsOverflowing(checkOverflow(descriptionRef.current!));
  }, []);

  useEffect(() => {
    resizeObserver.current.observe(descriptionRef.current!);

    return () => {
      resizeObserver.current.disconnect();
    };
  }, []);

  return (
    <li
      ref={wrapperRef}
      className={`${styles.lineMsg} ${isOpen ? styles.open : ""}`}
      key={message.id}
      style={{
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
        {message.id + ":"}
      </div>
      <div
        className={styles.description}
        style={{ color: hslColorToString(color) }}
        ref={descriptionRef}
      >
        {message.description}
      </div>
      {count > 1 && <Counter className={styles.counter} count={count} />}
    </li>
  );
};

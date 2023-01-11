import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageItem/MessageItem.module.scss";
import { Message } from "@models/Message";
import { Counter } from "@components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageItem/Counter/Counter";
import { getSofterHSLAColor, HSLAColor, hslaToString } from "@utils/color";
import { Caret } from "@components/Caret/Caret";
import { memo } from "react";
interface Props {
  message: Message;
  color: HSLAColor;
  onHandleScroll: () => void;
}

const MessageItem = ({ message, color, onHandleScroll }: Props) => {
  const [isOverflowing, setIsOverflowing] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef<HTMLLIElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const resizeObserver = useRef(
    new ResizeObserver((entries) => {
      let descriptionElement = entries[0].target as HTMLElement;
      setIsOverflowing(checkOverflow(descriptionElement));
    })
  );

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
        backgroundColor: hslaToString(getSofterHSLAColor(color, 48)),
      }}
    >
      {isOverflowing && (
        <Caret
          className={styles.caret}
          isOpen={isOpen}
          onClick={() => {
            setIsOpen((current) => !current);
            //onHandleScroll();
          }}
        />
      )}
      <div className={styles.idMsg} style={{ color: hslaToString(color) }}>
        {message.id + ":"}
      </div>
      <div
        className={styles.description}
        style={{ color: hslaToString(color) }}
        ref={descriptionRef}
      >
        {message.description}
      </div>
      {message.count > 1 && (
        <Counter className={styles.counter} count={message.count} />
      )}
    </li>
  );
};

export default memo(MessageItem);

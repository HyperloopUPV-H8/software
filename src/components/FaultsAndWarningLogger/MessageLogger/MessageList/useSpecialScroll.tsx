import { Message } from "@models/Message";
import { useEffect, useRef } from "react";

export const useSpecialScroll = (
  scrollUlRef: React.RefObject<HTMLUListElement>,
  useEffectDeps: Message[]
) => {
  const isBottomLocked = useRef(true);
  const scrollY = useRef(0);

  function handleScroll(ev: React.UIEvent<HTMLElement>) {
    const bottom =
      ev.currentTarget.scrollHeight - ev.currentTarget.scrollTop ===
      ev.currentTarget.clientHeight;

    ev.currentTarget;
    if (isBottomLocked.current) {
      if (scrollY.current > scrollUlRef.current!.scrollTop) {
        isBottomLocked.current = false;
      }
    } else if (bottom && !isBottomLocked.current) {
      isBottomLocked.current = true;
    }
  }

  function scrollToBottom() {
    scrollUlRef.current?.scrollTo({
      top: scrollUlRef.current.scrollHeight,
      behavior: "smooth",
    });

    scrollY.current = scrollUlRef.current!.scrollTop;
  }

  useEffect(() => {
    if (isBottomLocked.current) {
      scrollToBottom();
    }
  }, [useEffectDeps]);

  return [handleScroll];
};

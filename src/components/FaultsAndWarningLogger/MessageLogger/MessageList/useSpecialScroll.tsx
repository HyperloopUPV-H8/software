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

    if (isBottomLocked.current) {
      console.log(scrollUlRef.current!.scrollTop);
      //FIXME: When there is a duplicate message, an autoscroll occurs. Before the limitation of messages it didn't happened
      if (scrollY.current >= scrollUlRef.current!.scrollTop) {
        isBottomLocked.current = false;
        console.log("scroll up");
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

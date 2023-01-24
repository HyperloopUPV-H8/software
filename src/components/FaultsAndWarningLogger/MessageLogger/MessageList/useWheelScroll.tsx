import { Message } from "@models/Message";
import { useEffect, useRef } from "react";

export const useWheelScroll = (
  scrollUlRef: React.RefObject<HTMLUListElement>,
  useEffectDeps: Message[],
  isBottomLocked: React.MutableRefObject<boolean>
) => {
  function handleWheel(ev: WheelEvent) {
    const bottom =
      scrollUlRef.current!.scrollHeight - scrollUlRef.current!.scrollTop ===
      scrollUlRef.current?.clientHeight;

    if (isBottomLocked.current) {
      console.log(scrollUlRef.current!.scrollTop);
      //FIXME: When there is a duplicate message, an autoscroll occurs. Before the limitation of messages it didn't happened
      if (ev.deltaY < 0) {
        isBottomLocked.current = false;
        console.log("scroll up");
        console.log(ev.deltaY);
      }
    } else if (bottom && !isBottomLocked.current) {
      isBottomLocked.current = true;
    }
  }

  //   function scrollToBottom() {
  //     scrollUlRef.current?.scrollTo({
  //       top: scrollUlRef.current.scrollHeight,
  //       behavior: "smooth",
  //     });
  //   }

  //   useEffect(() => {
  //     if (isBottomLocked.current) {
  //       scrollToBottom();
  //     }
  //   }, [useEffectDeps]);

  return [handleWheel];
};

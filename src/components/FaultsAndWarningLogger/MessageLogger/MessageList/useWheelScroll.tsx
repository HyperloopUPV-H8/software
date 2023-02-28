import { Message } from "models/Message";
import { useEffect, WheelEvent } from "react";
export const useWheelScroll = (
    scrollUlRef: React.RefObject<HTMLUListElement>,
    messages: Message[],
    isBottomLocked: React.MutableRefObject<boolean>
) => {
    function handleWheel(ev: WheelEvent) {
        const bottom =
            scrollUlRef.current!.scrollHeight -
                scrollUlRef.current!.scrollTop ===
            scrollUlRef.current?.clientHeight;

        if (isBottomLocked.current) {
            if (ev.deltaY < 0) {
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
    }

    useEffect(() => {
        if (isBottomLocked.current) {
            scrollToBottom();
        }
    }, [messages]);

    return handleWheel;
};

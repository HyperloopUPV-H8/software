import { useGlobalTicker } from "common";
import { useLayoutEffect, useRef } from "react";

export function useTextUpdater(getText: () => string) {
    const ref = useRef<HTMLElement>(null);
    const textNodeRef = useRef<Text>();
    useLayoutEffect(() => {
        const textNode = document.createTextNode("");
        textNodeRef.current = textNode;
        ref.current?.appendChild(textNode);

        return () => {
            ref.current?.removeChild(textNode);
        };
    }, []);

    useGlobalTicker(() => {
        const text = getText();

        if (textNodeRef.current) {
            textNodeRef.current.nodeValue = text;
        }
    });

    return ref;
}

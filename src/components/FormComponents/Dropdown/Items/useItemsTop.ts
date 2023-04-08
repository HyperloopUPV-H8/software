import { useRef } from "react";
import { useLayoutEffect } from "react";
import { useState } from "react";

const HEADER_ITEMS_GAP = 6;

export function useItemsTop(targetRect: DOMRect) {
    const [top, setTop] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const availableHeight =
            window.innerHeight - targetRect.y - targetRect.height;
        const itemsHeight = ref.current!.getBoundingClientRect().height;
        if (itemsHeight < availableHeight) {
            setTop(targetRect.height + HEADER_ITEMS_GAP);
        } else {
            setTop(-itemsHeight - HEADER_ITEMS_GAP);
        }
    }, [targetRect]);

    return [ref, top] as const;
}

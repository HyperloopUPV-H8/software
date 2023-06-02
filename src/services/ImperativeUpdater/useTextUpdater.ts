import { useContext, useLayoutEffect, useRef } from "react";
import { ImperativeUpdaterContext } from "./ImperativeUpdater";

export function useTextUpdater(id: string) {
    const ref = useRef<HTMLElement>(null);
    const updater = useContext(ImperativeUpdaterContext);

    useLayoutEffect(() => {
        const node = document.createTextNode("");
        ref.current?.appendChild(node);

        const handler = (value: any) => (node.nodeValue = value);

        updater.add(id, handler);

        return () => {
            updater.remove(id, handler);
            ref.current?.removeChild(node);
        };
    }, []);

    return ref;
}

import { useContext, useLayoutEffect, useRef } from "react";
import { ImperativeUpdaterContext } from "./ImperativeUpdater";

export function useCustomUpdater(id: string, callback: (value: any) => void) {
    const updater = useContext(ImperativeUpdaterContext);

    useLayoutEffect(() => {
        const handler = (value: any) => callback(value);
        updater.add(id, handler);

        return () => {
            updater.remove(id, handler);
        };
    }, []);
}

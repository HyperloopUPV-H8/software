import { useCallback } from "react";

export function useListenKey(key: string, callback: () => unknown) {
    const listener = useCallback(
        (ev: KeyboardEvent) => {
            if (ev.key == key) {
                callback();
            }
        },
        [key, callback]
    );

    function listen(value: boolean) {
        if (value) {
            document.addEventListener("keydown", listener);
        } else {
            document.removeEventListener("keydown", listener);
        }
    }

    return listen;
}

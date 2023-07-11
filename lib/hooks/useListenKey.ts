import { useEffect } from "react";

export function useListenKey(
    key: string,
    callback: () => unknown,
    listen: boolean
) {
    const listener = (ev: KeyboardEvent) => {
        console.log(ev.key);
        if (ev.key == key) {
            ev.preventDefault();
            callback();
        }
    };

    useEffect(() => {
        if (listen) {
            document.addEventListener("keydown", listener);
        }

        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [listen, key, listener, callback]);
}

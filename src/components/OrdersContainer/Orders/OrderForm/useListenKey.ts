import { useEffect, useState } from "react";

export function useListenKey(key: string, callback: () => unknown) {
    const [listen, setListen] = useState(false);

    const listener = (ev: KeyboardEvent) => {
        if (ev.key == key) {
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

    return (value: boolean) => {
        setListen(value);
    };
}

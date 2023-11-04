import { useInterval } from "../../hooks/useInterval";
import { createContext, useRef } from "react";

type Callback = () => void;

export const GlobalTickerContext = createContext<{
    subscribe: (cb: Callback) => void;
    unsubscribe: (cb: Callback) => void;
}>({
    subscribe: () => {},
    unsubscribe: () => {},
});

type Props = {
    fps?: number;
    children?: React.ReactNode;
};

export const GlobalTicker = ({ fps = 30, children }: Props) => {
    const callbacks = useRef<Callback[]>([]);

    useInterval(() => {
        for (const cb of callbacks.current) {
            cb();
        }
    }, 1000 / fps);

    return (
        <GlobalTickerContext.Provider
            value={{
                subscribe: (cb) => {
                    callbacks.current.push(cb);
                },
                unsubscribe: (cb) => {
                    callbacks.current = callbacks.current.filter(
                        (item) => item != cb
                    );
                },
            }}
        >
            {children}
        </GlobalTickerContext.Provider>
    );
};

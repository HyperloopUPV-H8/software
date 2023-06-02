import { useInterval } from "hooks/useInterval";
import { createContext, useRef } from "react";

type Callback = () => void;

export const GlobalTickerContext = createContext({
    subscribe: (cb: Callback) => {},
    unsubscribe: (cb: Callback) => {},
});

type Props = {
    children?: React.ReactNode;
};

const FPS = 30;

export const GlobalTicker = ({ children }: Props) => {
    const callbacks = useRef<Callback[]>([]);

    useInterval(() => {
        for (const cb of callbacks.current) {
            cb();
        }
    }, 1000 / FPS);

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

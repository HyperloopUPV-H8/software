import { useContext, useEffect } from "react";
import { GlobalTickerContext } from "./GlobalTicker";

export function useGlobalTicker(cb: () => void) {
    const globalTicker = useContext(GlobalTickerContext);

    useEffect(() => {
        globalTicker.subscribe(cb);

        return () => {
            globalTicker.unsubscribe(cb);
        };
    }, [globalTicker]);
}

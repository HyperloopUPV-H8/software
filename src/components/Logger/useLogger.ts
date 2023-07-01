import { useSubscribe, useWsHandler } from "common";
import { useState } from "react";

export function useLogger() {
    const [state, setState] = useState(false);

    const handler = useWsHandler();

    const log = (enable: boolean) => {
        handler.post("logger/enable", enable);
    };

    function startLogging() {
        log(true);
    }

    function stopLogging() {
        log(false);
    }

    useSubscribe("logger/response", (result) => {
        setState(result);
    });

    return [state, startLogging, stopLogging] as const;
}

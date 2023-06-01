import { useSubscribe, useWsHandler } from "common";
import { useState } from "react";

export function useLogger() {
    const handler = useWsHandler();

    function startLogging() {
        handler.post("logger/enable", true);
    }
    function stopLogging() {
        handler.post("logger/enable", false);
    }
    const [state, setState] = useState(false);

    useSubscribe("logger/response", (state) => setState(state));

    return [state, startLogging, stopLogging] as const;
}

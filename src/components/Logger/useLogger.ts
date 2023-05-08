import { useBroker } from "common";
import { useState } from "react";

export function useLogger() {
    const sendWS = useBroker("logger/enable", (state) => setState(state));

    function startLogging() {
        sendWS(true);
    }
    function stopLogging() {
        sendWS(false);
    }

    const [state, setState] = useState(false);

    return [state, startLogging, stopLogging] as const;
}

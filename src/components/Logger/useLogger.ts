import { useBroker } from "common";

export function useLogger(cb: (state: boolean) => void) {
    const sendWS = useBroker("logger/enable");
    useBroker("logger/enable", (state) => cb(state));

    function startLogging() {
        sendWS(true);
    }
    function stopLogging() {
        sendWS(false);
    }

    return [startLogging, stopLogging];
}

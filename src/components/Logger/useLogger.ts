import { useBackendWebSocket } from "hooks/useBackendWebSocket";

export function useLogger() {
    const sendWS = useBackendWebSocket("logger");

    function startLogging() {
        sendWS("enable");
    }
    function stopLogging() {
        sendWS("disable");
    }

    return [startLogging, stopLogging];
}

import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";

export function useLogger() {
    const sendWS = useWebSocketBroker("logger");

    function startLogging() {
        sendWS("enable");
    }
    function stopLogging() {
        sendWS("disable");
    }

    return [startLogging, stopLogging];
}

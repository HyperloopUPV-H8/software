import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";

export function useLogger(cb: (state: boolean) => void) {
    const sendWS = useWebSocketBroker("logger/enable");
    useWebSocketBroker("logger/enable", (state) => cb(state));

    function startLogging() {
        sendWS(true);
    }
    function stopLogging() {
        sendWS(false);
    }

    return [startLogging, stopLogging];
}

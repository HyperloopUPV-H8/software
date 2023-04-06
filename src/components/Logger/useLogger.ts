import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";

export function useLogger(setState: React.Dispatch<React.SetStateAction<boolean>>) {
    const sendWS = useWebSocketBroker("logger/enable");
    useWebSocketBroker("logger/state", (state) => setState(state))

    function startLogging() {
        sendWS(true);
    }
    function stopLogging() {
        sendWS(false);
    }

    return [startLogging, stopLogging];
}

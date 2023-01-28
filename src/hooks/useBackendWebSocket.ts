import { WebSocketHandlerContext } from "services/WebSocketHandler";
import { useContext, useEffect } from "react";

export function useBackendWebSocket(
    type: string,
    callback?: (msg: any) => void
): (msg: any) => void {
    const webSocketHandler = useContext(WebSocketHandlerContext)!;

    useEffect(() => {
        if (callback) {
            webSocketHandler.addCallback(type, callback);
        }
        return () => {
            if (callback) {
                webSocketHandler.removeCallback(type, callback);
            }
        };
    }, []);

    return webSocketHandler.createSender(type).bind(webSocketHandler);
}

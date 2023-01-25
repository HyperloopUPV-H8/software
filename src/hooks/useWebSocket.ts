import { WebSocketHandlerContext } from "services/WebSocketHandler";
import { useContext, useEffect } from "react";

export function useWebSocket(
    path: string,
    callback: <T>(msg: T) => void
): (msg: any) => void {
    const webSocketHandler = useContext(WebSocketHandlerContext)!;

    useEffect(() => {
        webSocketHandler.addCallback(path, callback);

        return () => {
            webSocketHandler.removeCallback(path, callback);
        };
    }, []);

    return webSocketHandler.send;
}

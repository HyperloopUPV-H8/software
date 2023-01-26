import {
    WebSocketHandlerContext,
    TypeToCallback,
} from "services/WebSocketHandler";
import { useContext, useEffect } from "react";

export function useBackendWebSocket(
    typeToCallbacks: TypeToCallback[]
): (msg: any) => void {
    const webSocketHandler = useContext(WebSocketHandlerContext)!;

    useEffect(() => {
        for (const typeToCallback of typeToCallbacks) {
            webSocketHandler.addCallback(
                typeToCallback.type,
                typeToCallback.callback
            );
        }
        return () => {
            for (const typeToCallback of typeToCallbacks) {
                webSocketHandler.removeCallback(
                    typeToCallback.type,
                    typeToCallback.callback
                );
            }
        };
    }, []);

    return webSocketHandler.send.bind(webSocketHandler);
}

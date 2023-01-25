import { WebSocketHandlerContext } from "services/WebSocketHandler";
import { useContext, useEffect } from "react";
import { updatePodData } from "slices/podDataSlice";
import { PacketUpdate } from "adapters/PacketUpdate";
import { store } from "../store";

export function usePacketWebSocket(): void {
    const webSocketHandler = useContext(WebSocketHandlerContext)!;

    function packetUpdateHandler(msg: any) {
        const packetUpdates = JSON.parse(msg) as {
            [id: number]: PacketUpdate;
        };

        store.dispatch(updatePodData(packetUpdates));
    }

    useEffect(() => {
        const updatePath = import.meta.env.VITE_PACKETS_PATH;
        webSocketHandler.addHandler(updatePath, packetUpdateHandler);

        return () => {
            webSocketHandler.removeHandler(updatePath, packetUpdateHandler);
        };
    }, []);
}

import { useWebSocketBroker } from "./WebSocketBroker/useWebSocketBroker";

type BootloaderSuccess = "success";
type BootloaderError = "failure";

export type BootloaderResponse = BootloaderSuccess | BootloaderError;

export function useBootloader(onSuccess: () => void, onFailure: () => void) {
    return useWebSocketBroker("bootloader/upload", (msg) => {
        if (!msg.failure) {
            onSuccess();
        } else {
            onFailure();
        }
    });
}

import { postToBackend } from "services/HTTPHandler";
import { useWebSocketBroker } from "./WebSocketBroker/useWebSocketBroker";

type BootloaderSuccess = "success";
type BootloaderError = "failure";

export type BootloaderResponse = BootloaderSuccess | BootloaderError;

export function useBootloader(onSuccess: () => void, onFailure: () => void) {
    return useWebSocketBroker(
        "bootloader/upload",
        (msg: BootloaderResponse) => {
            if (msg == "success") {
                onSuccess();
            } else {
                onFailure();
            }
        }
    );
}

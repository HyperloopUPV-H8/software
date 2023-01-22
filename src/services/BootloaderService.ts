import { postToBackend } from "services/HTTPHandler";

export function sendBootloaderProgram(file: File): void {
    postToBackend(import.meta.env.VITE_BOOTLOADER_PATH, file);
}

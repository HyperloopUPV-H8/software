import { useBroker } from "common";

export type BootloaderUpload = { board: string; file: File };

export function useBootloader(
    onDownloadSuccess: (file: File) => void,
    onDownloadFailure: () => void,
    onSendSuccess: () => void,
    onSendFailure: () => void
) {
    const uploader = useBroker("blcu/upload", (msg) => {
        if (msg.success) {
            onSendSuccess();
        } else {
            onSendFailure();
        }
    });

    const downloader = useBroker("blcu/download", (msg) => {
        if (msg.success) {
            onDownloadSuccess(new File([msg.file], "program"));
        } else {
            onDownloadFailure();
        }
    });

    return { uploader, downloader } as const;
}

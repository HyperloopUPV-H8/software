import { useBroker } from "common";

export type BootloaderUpload = { board: string; file: File };

export function useBootloader(
    onDownloadSuccess: (file: File) => void,
    onDownloadFailure: () => void,
    onSendSuccess: () => void,
    onSendFailure: () => void,
    onProgress: (progress: number) => void // progress between 0 and 100
) {
    const uploader = useBroker("blcu/upload", (msg) => {
        if (msg.progress == 100) {
            onSendSuccess();
        } else if (msg.failure) {
            onSendFailure();
        } else {
            onProgress(msg.progress);
        }
    });

    const downloader = useBroker("blcu/download", (msg) => {
        if (msg.progress == 100) {
            onDownloadSuccess(new File([msg.file], "program"));
        } else if (msg.failure) {
            onDownloadFailure();
        } else {
            onProgress(msg.progress);
        }
    });

    return { uploader, downloader } as const;
}

import { useWsHandler } from "common";

export type BootloaderUpload = { board: string; file: File };

export function useBootloader(
    onDownloadSuccess: (file: File) => void,
    onDownloadFailure: () => void,
    onSendSuccess: () => void,
    onSendFailure: () => void,
    onProgress: (progress: number) => void // progress between 0 and 100
) {
    const handler = useWsHandler();

    //TODO: timeout if it takes to long
    const uploader = (board: string, file: string) => {
        handler.exchange("blcu/upload", { board, file }, (res, end) => {
            if (res.percentage == 100) {
                onSendSuccess();
                end();
            } else if (res.failure) {
                onSendFailure();
                end();
            } else {
                onProgress(res.percentage);
            }
        });
    };

    //TODO: timeout if it takes to long
    const downloader = (board: string) => {
        handler.exchange("blcu/download", { board }, (res, end) => {
            if (res.percentage == 100) {
                onDownloadSuccess(new File([res.file], "program"));
                end();
            } else if (res.failure) {
                onDownloadFailure();
                end();
            } else {
                onProgress(res.percentage);
            }
        });
    };

    return { uploader, downloader } as const;
}

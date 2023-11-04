import { useWsHandler } from "common";
import { nanoid } from "nanoid";

export type BootloaderUpload = { board: string; file: File };

export function useBootloader(
    onDownloadSuccess: () => void,
    onDownloadFailure: () => void,
    onUploadSuccess: () => void,
    onUploadFailure: () => void,
    onProgress: (progress: number) => void // progress between 0 and 100
) {
    const handler = useWsHandler();

    //TODO: timeout if it takes to long
    const handleUpload = (board: string, file: string) => {
        const id = nanoid();

        handler.exchange("blcu/upload", { board, file }, id, (res, _, end) => {
            if (res.percentage == 100) {
                onUploadSuccess();
                end();
            } else if (res.failure) {
                onUploadFailure();
                end();
            } else {
                onProgress(res.percentage);
            }
        });
    };

    //TODO: timeout if it takes to long
    const handleDownload = (board: string) => {
        const id = nanoid();
        handler.exchange("blcu/download", { board }, id, (res, _, end) => {
            if (res.percentage == 100) {
                onDownloadSuccess();
                end();
            } else if (res.failure) {
                onDownloadFailure();
                end();
            } else {
                onProgress(res.percentage);
            }
        });
    };

    return [handleUpload, handleDownload] as const;
}

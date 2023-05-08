export type BootloaderUploadRequest = { board: string; file: string };
export type BootloaderUploadResponse = { percentage: number; success: boolean };

export type BootloaderDownloadRequest = { board: string };
export type BootloaderDownloadResponse =
    | { success: false }
    | { success: true; file: string };

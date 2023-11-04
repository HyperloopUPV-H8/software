export type BootloaderViewState =
    | Empty
    | Send
    | Awaiting
    | UploadSuccess
    | UploadFailure
    | DownloadSuccess
    | DownloadFailure;

type Empty = {
    kind: "empty";
};

type Send = {
    kind: "send";
    file: File;
};

type Awaiting = {
    kind: "awaiting";
    progress: number; // Between 0 and 100
};

type UploadSuccess = {
    kind: "upload_success";
};

type UploadFailure = {
    kind: "upload_failure";
};

type DownloadSuccess = {
    kind: "download_success";
};

type DownloadFailure = {
    kind: "download_failure";
};

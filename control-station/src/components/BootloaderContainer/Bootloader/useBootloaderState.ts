import { BootloaderViewState } from "./BootloaderViewState";
import { useState } from "react";
import { useBootloader } from "./useBootloader";

export function useBootloaderState() {
    const [state, setState] = useState<BootloaderViewState>({ kind: "empty" });

    const [handleUpload, handleDownload] = useBootloader(
        onDownloadSuccess,
        onDownloadFailure,
        onUploadSuccess,
        onUploadFailure,
        onProgress
    );

    function upload(board: string, file: File) {
        file.arrayBuffer().then((arr) => {
            handleUpload(
                board,
                window.btoa(String.fromCharCode(...new Uint8Array(arr)))
            );
        });
    }

    function download(board: string) {
        handleDownload(board);
        setState({ kind: "awaiting", progress: 0 });
    }

    function onUploadSuccess() {
        setState({ kind: "upload_success" });
        trasitionToEmpy();
    }

    function onUploadFailure() {
        setState({ kind: "upload_failure" });
        trasitionToEmpy();
    }

    function onDownloadSuccess() {
        setState({ kind: "download_success" });
        trasitionToEmpy();
    }

    function onDownloadFailure() {
        setState({ kind: "download_failure" });
        trasitionToEmpy();
    }

    function trasitionToEmpy() {
        setTimeout(() => {
            setState(() => {
                return { kind: "empty" };
            });
        }, 1000);
    }

    function onProgress(progress: number) {
        setState({ kind: "awaiting", progress: progress });
    }

    function removeFile() {
        setState({ kind: "empty" });
    }

    function setFile(file: File) {
        setState({ kind: "send", file: file });
    }

    return [state, upload, download, setFile, removeFile] as const;
}

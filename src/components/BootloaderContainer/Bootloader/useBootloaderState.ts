import { BootloaderViewState } from "./BootloaderViewState";
import { useState } from "react";
import { useBootloader } from "services/useBootloader";

export function useBootloaderState() {
    const [state, setState] = useState<BootloaderViewState>({ kind: "empty" });

    const { uploader, downloader } = useBootloader(
        onSuccess,
        onFailure,
        onSuccess,
        onFailure
    );

    function upload(board: string, file: File) {
        file.text().then((value) => {
            uploader({ board: board, file: value });
            setState({ kind: "awaiting" });
        });
    }

    function download(board: string) {
        downloader({ board });
        setState({ kind: "awaiting" });
    }

    function onSuccess() {
        setState({ kind: "success" });
        setTimeout(() => {
            setState(() => {
                return { kind: "empty" };
            });
        }, 1000);
    }

    function onFailure() {
        setState({ kind: "failure" });
        setTimeout(() => {
            setState(() => {
                return { kind: "empty" };
            });
        }, 1000);
    }

    function removeFile() {
        setState({ kind: "empty" });
    }

    function setFile(file: File) {
        setState({ kind: "send", file: file });
    }

    return [state, upload, download, setFile, removeFile] as const;
}

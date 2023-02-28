import { useState, useEffect } from "react";
import { useDragAndDropFile } from "./useDragAndDropFile";
import { useBootloader } from "services/useBootloader";

export enum BootloaderState {
    EMPTY,
    READY_TO_SEND,
    AWAITING,
    SUCCESS,
    FAILURE,
}

export function useBootloaderUploaderState() {
    const [state, setState] = useState(BootloaderState.EMPTY);
    const [file, clearFile, dropHandler, dragOverHandler] =
        useDragAndDropFile();

    useEffect(() => {
        if (file) {
            setState(BootloaderState.READY_TO_SEND);
        }
    }, [file]);

    function onSendSuccess() {
        setState(BootloaderState.SUCCESS);
        setTimeout(() => {
            setState(() => {
                clearFile();
                return BootloaderState.EMPTY;
            });
        }, 1000);
    }

    function onSendFailure() {
        setState(BootloaderState.FAILURE);
        setTimeout(() => {
            setState(() => {
                clearFile();
                return BootloaderState.EMPTY;
            });
        }, 1000);
    }

    const sendToBootloader = useBootloader(onSendSuccess, onSendFailure);

    function sendFile() {
        setState(BootloaderState.AWAITING);
        if (file) {
            sendToBootloader(file);
        }
    }

    function onDrop(ev: React.DragEvent<HTMLDivElement>) {
        if (
            state == BootloaderState.EMPTY ||
            state == BootloaderState.READY_TO_SEND
        ) {
            dropHandler(ev);
        }
    }

    return [state, file, sendFile, onDrop, dragOverHandler] as const;
}

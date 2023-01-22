import { useState, DragEvent, DragEventHandler } from "react";

function isCorrectFormat(fileName: string, fileFormat: string): boolean {
    return fileName.endsWith(`.${fileFormat}`);
}

export function useDragAndDropFile(): [
    File | undefined,
    (ev: DragEvent<HTMLDivElement>) => void,
    (ev: DragEvent<HTMLDivElement>) => void
] {
    const [file, setFile] = useState<File>();

    function dropFileHandler(ev: DragEvent<HTMLDivElement>) {
        ev.preventDefault();

        if (ev.dataTransfer.items) {
            handleFileWithDataTransferItems(ev);
        } else {
            handleFileWidthDataTransferFiles(ev);
        }
    }

    function handleFileWithDataTransferItems(
        ev: DragEvent<HTMLDivElement>
    ): void {
        if (
            ev.dataTransfer.items.length > 1 ||
            ev.dataTransfer.items.length < 1
        ) {
            console.error("Expected one file");
        } else if (ev.dataTransfer.items[0].kind !== "file") {
            console.error("Dropped item is not file");
        } else if (
            !isCorrectFormat(
                [...ev.dataTransfer.items][0].getAsFile()!.name,
                "hex"
            )
        ) {
            const fileName = [...ev.dataTransfer.items][0].getAsFile()!.name;
            const extension = fileName.substring(fileName.lastIndexOf("."));

            console.error(
                `Incorrect file format: expected ".hex" got "${extension}"`
            );
        } else {
            setFile([...ev.dataTransfer.items][0].getAsFile()!);
        }
    }

    function handleFileWidthDataTransferFiles(
        ev: DragEvent<HTMLDivElement>
    ): void {
        if (
            ev.dataTransfer.files.length > 1 ||
            ev.dataTransfer.files.length < 1
        ) {
            console.error("Expected one file");
        } else {
            setFile([...ev.dataTransfer.files][0]);
        }
    }

    function dragOverHandler(ev: DragEvent<HTMLDivElement>) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    return [file, dropFileHandler, dragOverHandler];
}

import { useRef, useState } from "react";
import { LogSession, UploadState } from "../LogLoader";
import styles from "./Dropzone.module.scss"
import { processLoggerSession } from "../LogsProcessor";

type Props = {
    uploadState: UploadState;
    setUploadState: (newUploadState: UploadState) => void;
    addLogSession: (logSession: LogSession) => void;
}

export const Dropzone = ({uploadState, setUploadState}: Props) => {

    const dropZone = useRef<HTMLDivElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
    const [dropZoneText, setDropZoneText] = useState<string>("Drop the log session directory");
    const [draftSession, setDraftSession] = useState<Map<string, {time: Date, value: number}[]>>();

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.items;
        if(files.length != 1) {
            setUploadState(UploadState.ERROR);
            setDropZoneText("Please drop only one directory");
        };
        let file = files[0].webkitGetAsEntry();
        if(file && file.isDirectory) {
            setUploadState(UploadState.UPLOADING);
            setDropZoneText("Uploading...");
            const loggerSession = processLoggerSession(file as FileSystemDirectoryEntry);
            loggerSession.then((session) => {
                setDraftSession(new Map().set(file.name, session));
                setUploadState(UploadState.SUCCESS);
                setDropZoneText("Upload successful");
            }).catch((err) => {
                setUploadState(UploadState.ERROR);
                setDropZoneText("Upload failed: " + err.message);
            });
        } else {
            setUploadState(UploadState.ERROR);
            setDropZoneText("Upload failed: Please drop a directory");
        }
    };

    return (
        <div 
            className={`${styles.dropZone} 
            ${isDraggingOver ? styles.Active : ""}
            ${uploadState === UploadState.UPLOADING ? styles.Uploading : ""}
            ${uploadState === UploadState.SUCCESS ? styles.Success : ""}
            ${uploadState === UploadState.ERROR ? styles.Error : ""}
            `}
            ref={dropZone}
            onDragEnter={e => {
                e.preventDefault();
                setIsDraggingOver(true);
            }}
            onDragLeave={e => {
                e.preventDefault();
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                setIsDraggingOver(false);
            }}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
        >
            <div className={styles.dropZoneText}>
                <p>{dropZoneText}</p>
            </div>
        </div>
    )
}

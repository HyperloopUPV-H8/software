import { useEffect, useRef, useState } from "react";
import { LogSession, UploadState } from "../LogLoader";
import styles from "./Dropzone.module.scss"
import { processLoggerSession } from "../LogsProcessor";
import { Controls } from "../Controls/Controls";

type Props = {
    uploadState: UploadState;
    setUploadState: (newUploadState: UploadState) => void;
    addLogSession: (logSession: LogSession) => void;
}

export const Dropzone = ({uploadState, setUploadState, addLogSession}: Props) => {

    const dropZone = useRef<HTMLDivElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
    const [dropZoneText, setDropZoneText] = useState<string>();
    const [draftSession, setDraftSession] = useState<LogSession>();

    useEffect(() => {
        setDropZoneText(`${
            uploadState === UploadState.UPLOADING ? "Uploading..." :
            uploadState === UploadState.SUCCESS ? "Upload successful" :
            uploadState === UploadState.ERROR ? "Upload failed" : 
            "Drop a logger session directory here"
        }`);
    }, [uploadState]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.items;
        if(files.length != 1) setUploadState(UploadState.ERROR);
        let file = files[0].webkitGetAsEntry();
        if(file && file.isDirectory) {
            setUploadState(UploadState.UPLOADING);
            const loggerSession = processLoggerSession(file as FileSystemDirectoryEntry);
            loggerSession.then((session) => {
                setDraftSession(new Map().set(file.name, session));
                setUploadState(UploadState.SUCCESS);
            }).catch(() => {
                setUploadState(UploadState.ERROR);
            });
        } else {
            setUploadState(UploadState.ERROR);
        }
    };

    return (
        <div>
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

        
        <Controls
            uploadState={uploadState}
            setUploadState={setUploadState}
            onLoad={() => {
                if(draftSession) {
                    addLogSession(draftSession);
                    setUploadState(UploadState.IDLE);
                    setDraftSession(undefined);
                }
            }}
            onRemove={() => {
                setUploadState(UploadState.IDLE);
                setDraftSession(undefined);
            }}
        />

        </div>
    )
}


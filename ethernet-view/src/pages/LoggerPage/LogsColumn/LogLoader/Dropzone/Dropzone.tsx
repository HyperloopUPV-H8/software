import { useEffect, useRef, useState } from "react";
import { LogSession, UploadInformation, UploadState } from "../LogLoader";
import styles from "./Dropzone.module.scss"
import { processLoggerSession } from "../LogsProcessor";
import { Controls } from "../Controls/Controls";

type Props = {
    uploadInformation: UploadInformation;
    setUploadInformation: (newUploadInformation: UploadInformation) => void;
    addLogSession: (logSession: LogSession) => void;
}

export const Dropzone = ({uploadInformation, setUploadInformation, addLogSession}: Props) => {

    const dropZone = useRef<HTMLDivElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
    const [dropZoneText, setDropZoneText] = useState<string>();
    const [draftSession, setDraftSession] = useState<LogSession>();

    useEffect(() => {
        setDropZoneText(`${
            uploadInformation.state === UploadState.UPLOADING ? "Uploading..." :
            uploadInformation.state === UploadState.SUCCESS ? "Upload successful" :
            uploadInformation.state === UploadState.ERROR ? "Upload failed" : 
            "Drop a logger session directory here"
        }`);
    }, [uploadInformation]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.items;
        if(files.length != 1) setUploadInformation({state: UploadState.ERROR, errorMessage: "Only one file or directory is allowed"});
        let file = files[0].webkitGetAsEntry();
        if(file && file.isDirectory) {
            setUploadInformation({state: UploadState.UPLOADING});
            const loggerSession = processLoggerSession(file as FileSystemDirectoryEntry);
            loggerSession.then((session) => {
                setDraftSession(new Map().set(file.name, session));
                setUploadInformation({state: UploadState.SUCCESS});
            }).catch((error) => {
                setUploadInformation({state: UploadState.ERROR, errorMessage: error});
            });
        } else {
            setUploadInformation({state: UploadState.ERROR, errorMessage: "Only directories are allowed"});
        }
    };

    return (
        <div>
        <div 
            className={`${styles.dropZone} 
                ${isDraggingOver ? styles.Active : ""}
                ${uploadInformation.state === UploadState.UPLOADING ? styles.Uploading : ""}
                ${uploadInformation.state === UploadState.SUCCESS ? styles.Success : ""}
                ${uploadInformation.state === UploadState.ERROR ? styles.Error : ""}
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
                <p>
                    {dropZoneText}
                    <br/>
                    {uploadInformation.errorMessage}
                </p>
            </div>
        </div>

        
        <Controls
            uploadInformation={uploadInformation}
            onLoad={() => {
                if(draftSession) {
                    addLogSession(draftSession);
                    setUploadInformation({state: UploadState.IDLE});
                    setDraftSession(undefined);
                }
            }}
            onRemove={() => {
                setUploadInformation({state: UploadState.IDLE});
                setDraftSession(undefined);
            }}
        />

        </div>
    )
}

function checkFile(file: FileSystemEntry): boolean {
    
    return false;
}
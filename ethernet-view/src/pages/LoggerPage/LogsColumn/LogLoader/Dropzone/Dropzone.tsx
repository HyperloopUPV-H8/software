import { useState } from "react";
import { LogSession, UploadInformation, UploadState } from "../LogLoader";
import styles from "./Dropzone.module.scss"
import { extractLoggerSession } from "../LogsProcessor";
import { Controls } from "./Controls/Controls";
import { useDropzone } from "./useDropzone";

interface Props {
    uploadInformation: UploadInformation;
    setUploadInformation: (newUploadInformation: UploadInformation) => void;
    addLogSession: (logSession: LogSession) => void;
}

export const Dropzone = ({uploadInformation, setUploadInformation, addLogSession}: Props) => {

    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
    const {dropZoneText, draftSession, setDraftSession} = useDropzone({uploadInformation});

    const uploadSession = (directory: FileSystemDirectoryEntry) => {
        setUploadInformation({state: UploadState.UPLOADING});
        const loggerSession = extractLoggerSession(directory as FileSystemDirectoryEntry);
        loggerSession.then((session) => {
            console.log(session);
            setDraftSession({name: directory.name, measurementLogs: session} as LogSession);
            setUploadInformation({state: UploadState.SUCCESS});
        }).catch((error) => {
            if(error instanceof Error) {
                setUploadInformation({state: UploadState.ERROR, errorMessage: error.message});
            } else {
                setUploadInformation({state: UploadState.ERROR, errorMessage: "An unexpected error occurred"});
            }
        });
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        try {
            validateEntry(e.dataTransfer.items);
            const directory = e.dataTransfer.items[0].webkitGetAsEntry();
            uploadSession(directory as FileSystemDirectoryEntry);
        } catch(err) {
            if (err instanceof Error){
                setUploadInformation({state: UploadState.ERROR, errorMessage: err.cause as string});
            } else {
                setUploadInformation({state: UploadState.ERROR, errorMessage: "An unexpected error occurred"});
            }
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

/**
 * The function `validateEntry` checks if only one directory is selected from a list of files.
 * @param {DataTransferItemList} files - The `files` parameter in the `validateEntry` function is of
 * type `DataTransferItemList`, which represents a list of items.
 */
function validateEntry(files: DataTransferItemList) {
    if(files.length != 1) throw new Error("Only one file or directory is allowed");
    let file = files[0].webkitGetAsEntry();
    if(!file) throw new Error("Invalid file");
    if(!file.isDirectory) throw new Error("Only directories are allowed");
}
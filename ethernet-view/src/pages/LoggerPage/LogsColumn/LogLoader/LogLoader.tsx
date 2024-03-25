import { useEffect, useState } from "react"
import { Dropzone } from "./Dropzone/Dropzone"
import styles from "./LogLoader.module.scss"

export enum UploadState {
    IDLE = "idle",
    UPLOADING = "uploading",
    SUCCESS = "success",
    ERROR = "error",
}

export type LogSession = Map<string, {time: Date, value: number}[]>;
export type LogSessionCollection = Map<string, {time: Date, value: number}[]>[];

export const LogLoader = () => {

    const [uploadState, setUploadState] = useState<UploadState>(UploadState.IDLE);
    const [logSessions, setLogSessions] = useState<LogSessionCollection>([]);

    useEffect(() => {
        console.log(logSessions);
    })

    return (
        <div className={styles.logLoaderWrapper}>
            <Dropzone 
                uploadState={uploadState}
                setUploadState={setUploadState}
                addLogSession={(logSession: LogSession) => setLogSessions([...logSessions, logSession])}
            />
        </div>
    )
}

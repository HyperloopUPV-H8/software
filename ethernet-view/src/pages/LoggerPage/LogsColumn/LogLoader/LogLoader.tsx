import { useEffect, useState } from "react"
import { Dropzone } from "./Dropzone/Dropzone"
import styles from "./LogLoader.module.scss"

export enum UploadState {
    IDLE = "idle",
    UPLOADING = "uploading",
    SUCCESS = "success",
    ERROR = "error",
}

export interface UploadInformation {
    state: UploadState;
    errorMessage?: string;
}

export type LogSession = Map<string, {time: Date, value: number}[]>;
export type LogSessionCollection = Map<string, {time: Date, value: number}[]>[];

export const LogLoader = () => {

    const [uploadInformation, setUploadInformation] = useState<UploadInformation>({state: UploadState.IDLE});
    const [logSessions, setLogSessions] = useState<LogSessionCollection>([]);

    useEffect(() => {
        console.log(logSessions);
    })

    return (
        <div className={styles.logLoaderWrapper}>
            <Dropzone 
                uploadInformation={uploadInformation}
                setUploadInformation={setUploadInformation}
                addLogSession={(logSession: LogSession) => setLogSessions([...logSessions, logSession])}
            />
        </div>
    )
}

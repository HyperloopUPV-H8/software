import { useState } from "react"
import { Dropzone } from "./Dropzone/Dropzone"
import styles from "./LogLoader.module.scss"
import { LogList } from "./LogList/LogList";

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

export interface LogSession {
    name: string;
    measurementLogs: Map<string, {time: Date, value: number}[]>;
}
export type LogSessionCollection = LogSession[];

export const LogLoader = () => {

    const [uploadInformation, setUploadInformation] = useState<UploadInformation>({state: UploadState.IDLE});
    const [logSessions, setLogSessions] = useState<LogSessionCollection>([]);

    return (
        <div className={styles.logLoaderWrapper}>

            <LogList logNames={logSessions.map((logSession) => logSession.name)} />

            <Dropzone 
                uploadInformation={uploadInformation}
                setUploadInformation={setUploadInformation}
                addLogSession={(logSession: LogSession) => setLogSessions([...logSessions, logSession])}
            />

        </div>
    )
}

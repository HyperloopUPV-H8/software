import { useState } from "react"
import { Dropzone } from "./Dropzone/Dropzone"
import { Controls } from "./Controls/Controls";

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

    return (
        <>
            <Dropzone 
                uploadState={uploadState}
                setUploadState={setUploadState}
                addLogSession={(logSession: LogSession) => setLogSessions([...logSessions, logSession])}
            />
            <Controls />
        </>
    )
}

import styles from "./Bootloader.module.scss";
import { ReactNode, useState } from "react";
import { DropElement } from "./DropElement/DropElement";
import { SendElement } from "./SendElement/SendElement";
import { useBootloaderState } from "./useBootloaderState";
import { LoadingElement } from "./LoadingElement/LoadingElement";
import { ResponseElement } from "./ResponseElement/ResponseElement";
import { Controls } from "./Controls/Controls";
import { BootloaderViewState } from "./BootloaderViewState";

type Props = {
    boards: string[];
};

export const Bootloader = ({ boards }: Props) => {
    const [state, upload, download, setFile, removeFile] = useBootloaderState();
    const [board, setBoard] = useState(boards[0] ?? "Default");

    return (
        <div className={styles.bootloader}>
            {state.kind == "empty" && <DropElement onFile={setFile} />}
            {state.kind == "send" && (
                <SendElement
                    file={{
                        name: state.file.name,
                        size: state.file.size,
                    }}
                    onRemove={() => removeFile()}
                />
            )}
            {state.kind == "awaiting" && (
                <LoadingElement progress={state.progress} />
            )}
            {(state.kind == "upload_success" ||
                state.kind == "download_success") && (
                <ResponseElement success={true} />
            )}
            {(state.kind == "upload_failure" ||
                state.kind == "download_failure") && (
                <ResponseElement success={false} />
            )}
            {(state.kind == "empty" || state.kind == "send") && (
                <Controls
                    options={boards}
                    enableUpload={state.kind == "send"}
                    onBoardChange={(board) => setBoard(board)}
                    onDownloadClick={() => download(board)}
                    onUploadClick={() => {
                        if (state.kind == "send") upload(board, state.file);
                    }}
                />
            )}
        </div>
    );
};

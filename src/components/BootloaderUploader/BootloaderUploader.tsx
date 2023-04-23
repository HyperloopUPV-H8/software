import styles from "components/BootloaderUploader/BootloaderUploader.module.scss";
import { DropElement } from "components/BootloaderUploader/DropElement/DropElement";
import { SendElement } from "components/BootloaderUploader/SendElement/SendElement";
import {
    BootloaderState,
    useBootloaderUploaderState,
} from "./useBootloaderUploaderState";
import { AwaitElement } from "./AwaitElement/AwaitElement";
import { ResponseElement } from "./ResponseElement/ResponseElement";

export const BootloaderUploader = () => {
    const [state, file, sendFile, dropHandler, dragOverHandler] =
        useBootloaderUploaderState();

    return (
        <section
            className={`${styles.bootloaderUploaderWrapper} island`}
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
        >
            {state == BootloaderState.EMPTY && <DropElement />}
            {/* {state == BootloaderState.READY_TO_SEND && (
                <SendElement
                    fileName={file!.name}
                    onSendBtnClick={sendFile}
                />
            )} */}
            {state == BootloaderState.AWAITING && <AwaitElement />}
            {state == BootloaderState.SUCCESS && (
                <ResponseElement response="success" />
            )}
            {state == BootloaderState.FAILURE && (
                <ResponseElement response="failure" />
            )}
        </section>
    );
};

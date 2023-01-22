import styles from "components/BootloaderUploader/BootloaderUploader.module.scss";
import { useDragAndDropFile } from "components/BootloaderUploader/useDragAndDropFile";
import { DropElement } from "components/BootloaderUploader/DropElement/DropElement";
import { SendElement } from "components/BootloaderUploader/SendElement/SendElement";
import { sendBootloaderProgram } from "services/BootloaderService";
export const BootloaderUploader = () => {
    const [file, dropFileHandler, dragOverHandler] = useDragAndDropFile();

    return (
        <section
            className={`${styles.bootloaderWrapper} island`}
            onDrop={dropFileHandler}
            onDragOver={dragOverHandler}
        >
            {!file && <DropElement />}
            {file && (
                <SendElement
                    fileName={file.name}
                    onSendBtnClick={() => {
                        sendBootloaderProgram(file);
                    }}
                />
            )}
        </section>
    );
};

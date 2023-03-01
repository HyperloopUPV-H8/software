import styles from "components/BootloaderUploader/DropElement/DropElement.module.scss";

export const DropElement = () => {
    return (
        <div className={styles.dropElementWrapper}>
            Drop your <code>.hex</code> file here
        </div>
    );
};

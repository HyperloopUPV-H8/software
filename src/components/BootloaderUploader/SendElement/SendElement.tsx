import styles from "components/BootloaderUploader/SendElement/SendElement.module.scss";
import { Button } from "components/FormComponents/Button/Button";

type Props = {
    fileName: string;
    onSendBtnClick: () => void;
};

export const SendElement = ({ fileName, onSendBtnClick }: Props) => {
    return (
        <div className={styles.sendElementWrapper}>
            <code>{fileName}</code>
            <Button label="Upload" onClick={onSendBtnClick} />
        </div>
    );
};

import styles from "./OrderHeader.module.scss";
import { Button } from "components/FormComponents/Button/Button";
import { Caret } from "components/Caret/Caret";
type Props = {
    isButtonEnabled: boolean;
    onButtonClick: () => void;
    isCaretVisible: boolean;
    isCaretOpen: boolean;
    toggleDropdown: () => void;
    name: string;
};

export const OrderHeader = ({
    isButtonEnabled,
    isCaretVisible,
    isCaretOpen,
    toggleDropdown,
    name,
    onButtonClick,
}: Props) => {
    return (
        <div className={styles.wrapper}>
            <div
                className={styles.caretWrapper}
                style={{ display: isCaretVisible ? "flex" : "none" }}
                onClick={toggleDropdown}
            >
                <Caret isOpen={isCaretOpen} />
            </div>
            <div className={styles.name}>{name}</div>
            <div className={styles.sendBtn}>
                <Button
                    label="send"
                    onClick={onButtonClick}
                    disabled={!isButtonEnabled}
                />
            </div>
        </div>
    );
};

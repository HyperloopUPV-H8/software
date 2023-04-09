import styles from "./Header.module.scss";
import { Button } from "components/FormComponents/Button/Button";
import { Caret } from "components/Caret/Caret";
type Props = {
    disabled: boolean;
    onButtonClick: () => void;
    hasFields: boolean;
    isOpen: boolean;
    toggleDropdown: () => void;
    name: string;
};

export const Header = ({
    disabled,
    hasFields,
    isOpen,
    toggleDropdown,
    name,
    onButtonClick,
}: Props) => {
    return (
        <div
            className={styles.headerWrapper}
            onClick={toggleDropdown}
            style={{ cursor: hasFields ? "pointer" : "auto" }}
        >
            <Caret
                isOpen={isOpen}
                className={`${styles.caret} ${
                    hasFields ? styles.visible : styles.hidden
                }`}
            />
            <div className={styles.name}>{name}</div>
            <div className={styles.sendBtn}>
                <Button
                    label="send"
                    onClick={(ev) => {
                        onButtonClick();
                        ev.stopPropagation();
                    }}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

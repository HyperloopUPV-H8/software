import styles from "./Header.module.scss";
import { useState } from "react";
import { Button } from "components/FormComponents/Button/Button";
import { Caret } from "components/Caret/Caret";
import { ReactComponent as Target } from "assets/svg/target.svg";
type Props = {
    disabled: boolean;
    hasFields: boolean;
    isOpen: boolean;
    toggleDropdown: () => void;
    onTargetClick: (state: boolean) => void;
    onButtonClick: () => void;
    name: string;
};

export const Header = ({
    disabled,
    hasFields,
    isOpen,
    toggleDropdown,
    name,
    onTargetClick,
    onButtonClick,
}: Props) => {
    const [targetOn, setTargetOn] = useState(false);

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
            <Target
                className={`${styles.target} ${
                    targetOn ? styles.targetVisible : ""
                }`}
                onClick={(ev) => {
                    ev.stopPropagation();
                    setTargetOn((prev) => {
                        onTargetClick(!prev);
                        return !prev;
                    });
                }}
            />
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

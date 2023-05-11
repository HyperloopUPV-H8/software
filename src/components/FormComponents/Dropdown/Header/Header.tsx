import { Caret } from "components/Caret/Caret";
import styles from "./Header.module.scss";

type Props = {
    value: string;
    onClick: () => void;
    isOpen: boolean;
    isEnabled: boolean;
};

export const Header = ({ value, onClick, isOpen, isEnabled }: Props) => {
    return (
        <div
            className={`${styles.headerWrapper} ${
                isEnabled ? styles.enabled : ""
            }`}
            onClick={onClick}
        >
            <span className={styles.label}>{value}</span>{" "}
            {isEnabled && (
                <Caret
                    className={styles.caret}
                    isOpen={isOpen}
                />
            )}
        </div>
    );
};

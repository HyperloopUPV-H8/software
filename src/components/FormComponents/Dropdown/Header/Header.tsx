import { Caret } from "components/Caret/Caret";
import styles from "./Header.module.scss";

type Props = {
    value: string;
    onClick: () => void;
    isOpen: boolean;
};

export const Header = ({ value, onClick, isOpen }: Props) => {
    return (
        <div
            className={styles.headerWrapper}
            onClick={onClick}
        >
            {value}{" "}
            <Caret
                className={styles.caret}
                isOpen={isOpen}
            />
        </div>
    );
};

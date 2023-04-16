import styles from "components/ReceiveTable/Boards/BoardSection/Header/Header.module.scss";
import { Caret } from "components/Caret/Caret";
import { memo } from "react";
type Props = {
    boardName: string;
    isCaretOpen: boolean;
    toggleDropdown: () => void;
};

const Header = ({ boardName, isCaretOpen, toggleDropdown }: Props) => {
    return (
        <div
            className={styles.header}
            onClick={toggleDropdown}
        >
            <Caret isOpen={isCaretOpen} />
            {<div className={styles.name}>{boardName}</div>}
        </div>
    );
};

export default memo(Header);

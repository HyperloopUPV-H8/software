import styles from "@components/Caret/Caret.module.scss";
import { BsFillCaretRightFill } from "react-icons/bs";
type Props = {
  isOpen: boolean;
  onClick: () => void;
};

export const Caret = ({ isOpen, onClick }: Props) => {
  return (
    <div
      className={styles.wrapper}
      onClick={onClick}
      style={{ transform: isOpen ? "rotate(90deg)" : "" }}
    >
      {<BsFillCaretRightFill />}
    </div>
  );
};

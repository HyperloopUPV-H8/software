import styles from "@components/TransmitTable/OrderHeader/OrderHeader.module.scss";
import { Button } from "@components/FormComponents/Button/Button";
import { Caret } from "@components/Caret/Caret";
type Props = {
  isButtonEnabled: boolean;
  isCaretVisible: boolean;
  isCaretOpen: boolean;
  toggleDropdown: () => void;
  name: string;
  sendOrder: () => void;
};

export const OrderHeader = ({
  isButtonEnabled,
  isCaretVisible,
  isCaretOpen,
  toggleDropdown,
  name,
  sendOrder,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.caretWrapper}
        style={{ visibility: isCaretVisible ? "visible" : "hidden" }}
        onClick={toggleDropdown}
      >
        <Caret isOpen={isCaretOpen} />
      </div>
      <div className={styles.name}>{name}</div>
      <div className={styles.sendBtn}>
        <Button onClick={sendOrder} disabled={!isButtonEnabled} />
      </div>
    </div>
  );
};

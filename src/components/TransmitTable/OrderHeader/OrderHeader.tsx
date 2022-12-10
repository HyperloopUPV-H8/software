import styles from "@components/TransmitTable/OrderHeader/OrderHeader.module.scss";
import { Button } from "@components/FormComponents/Button";
import { Caret } from "@components/Caret/Caret";
type Props = {
  isCaretVisible: boolean;
  toggleDropdown: () => void;
  isDropdownVisible: boolean;
  name: string;
  sendOrder: () => void;
};

export const OrderHeader = ({
  isCaretVisible,
  toggleDropdown,
  isDropdownVisible,
  name,
  sendOrder,
}: Props) => {
  return (
    <div id={styles.wrapper}>
      <div
        className={styles.caretWrapper}
        style={{ visibility: isCaretVisible ? "visible" : "hidden" }}
      >
        <Caret isOpen={isDropdownVisible} onClick={toggleDropdown} />
      </div>
      <div id={styles.name}>{name}</div>
      <div id={styles.sendBtn}>
        <Button onClick={sendOrder} />
      </div>
    </div>
  );
};

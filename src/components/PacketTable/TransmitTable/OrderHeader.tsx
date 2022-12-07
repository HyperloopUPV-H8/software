import styles from "@components/PacketTable/TransmitTable/OrderHeader.module.scss";
import { BsFillCaretRightFill } from "react-icons/bs";
import { Button } from "@components/FormComponents/Button";

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
      {isCaretVisible && (
        <div
          id={styles.caret}
          onClick={toggleDropdown}
          style={{ transform: isDropdownVisible ? "rotate(90deg)" : "" }}
        >
          {<BsFillCaretRightFill />}
        </div>
      )}
      <div id={styles.name}>{name}</div>
      <div id={styles.sendBtn}>
        <Button onClick={sendOrder} />
      </div>
    </div>
  );
};

import ConsoleList from "@components/MessageLogger/ConsoleList/ConsoleList";
import { RootState } from "store";
import { useSelector } from "react-redux";
import styles from "@components/MessageLogger/FaultsAndWarningList/FaultsAndWarningList.module.scss";

const warningColor = { h: 41, s: 100, l: 40 };
const faultColor = { h: 0, s: 100, l: 40 };

export const FaultsAndWarningList = () => {
  const warningMessages = useSelector(
    (state: RootState) => state.messages.warning
  );
  const faultMessages = useSelector((state: RootState) => state.messages.fault);

  return (
    <div className={styles.containerMessages}>
      <ConsoleList
        title={"Warnings"}
        messages={warningMessages}
        color={warningColor}
      />
      <ConsoleList
        title={"Faults"}
        messages={faultMessages}
        color={faultColor}
      />
    </div>
  );
};

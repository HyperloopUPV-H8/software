import ConsoleList from "@components/MessageLogger/ConsoleList/ConsoleList";
import { RootState } from "store";
import { useSelector } from "react-redux";
import styles from "@components/MessageLogger/FaultsAndWarningList/FaultsAndWarningList.module.scss";
import { warningMessages, faultMessages } from "../messagesMock";

export const FaultsAndWarningList = () => {
  // const [warningMessages, faultMessages] = useSelector((state: RootState) => [
  //   state.messages.warning,
  //   state.messages.fault,
  // ]);

  return (
    <div className={styles.containerMessages}>
      <ConsoleList
        title={"Warnings"}
        messages={warningMessages}
        color={{ h: 41, s: 100, l: 40 }}
      />
      <ConsoleList
        title={"Faults"}
        messages={faultMessages}
        color={{ h: 0, s: 100, l: 40 }}
      />
    </div>
  );
};

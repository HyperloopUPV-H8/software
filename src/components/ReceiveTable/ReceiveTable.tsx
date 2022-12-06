import { useSelector } from "react-redux";
import { RootState } from "store";
import styles from "@components/ReceiveTable/ReceiveTable.module.scss";
import { Headers } from "@components/ReceiveTable/Headers/Headers";
import BoardSection from "@components/ReceiveTable/BoardSection/BoardSection";

export const ReceiveTable = () => {
  const boards = useSelector((state: RootState) => state.podData.boards);
  return (
    <div id={styles.wrapper}>
      <table id={styles.table}>
        <Headers />
        <tbody id={styles.tableBody}>
          {Object.values(boards).map((board) => {
            return <BoardSection key={board.name} board={board} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

import { useSelector } from "react-redux";
import { RootState } from "store";
import styles from "@components/PacketTable/ReceiveTable/ReceiveTable.module.scss";
import { PacketRow } from "@components/PacketTable/ReceiveTable/PacketRow";

export const ReceiveTable = ({}) => {
  const podData = useSelector((state: RootState) => state.podData);
  return (
    <div id={styles.wrapper}>
      <table id={styles.table}>
        <thead id={styles.headers}>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>HEX VALUE</th>
            <th>COUNT</th>
            <th>CYCLE TIME</th>
          </tr>
        </thead>

        <tbody id={styles.tableBody}>
          {podData.boards.map((board) => {
            return (
              <>
                <tr key={board.name} className={styles.boardRow}>
                  <span className={styles.boardName}>{board.name}</span>
                </tr>
                {board.packets.map((packet) => {
                  return (
                    <PacketRow key={packet.id} packet={packet}></PacketRow>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  //return <div>{JSON.stringify(podData)}</div>;
};

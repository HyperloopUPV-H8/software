import { useSelector } from "react-redux";
import { RootState } from "store";
import styles from "@components/PacketTable/ReceiveTable/ReceiveTable.module.scss";
import { PacketRow } from "@components/PacketTable/ReceiveTable/PacketRow";
import React from "react";

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
              <React.Fragment key={board.name}>
                <tr className={styles.boardRow}>
                  <td colSpan={5}>
                    <span className={styles.boardName}>{board.name}</span>
                  </td>
                </tr>
                {board.packets.map((packet) => {
                  return (
                    <PacketRow key={packet.id} packet={packet}></PacketRow>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  //return <div>{JSON.stringify(podData)}</div>;
};

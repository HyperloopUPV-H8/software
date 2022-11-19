import { useSelector } from "react-redux";
import { RootState } from "store";
import styles from "@components/PacketTable/ReceiveTable/ReceiveTable.module.scss";
import { PacketRow } from "@components/PacketTable/ReceiveTable/PacketRow";
import { Board } from "@models/PodData/Board";
import React from "react";

export const ReceiveTable = ({}) => {
  const podData = useSelector((state: RootState) => state.podData);
  return (
    <div id={styles.wrapper}>
      <table id={styles.table}>
        {getHeaders()}
        <tbody id={styles.tableBody}>
          {Object.values(podData.boards).map((board) => {
            return getBoardSection(board);
          })}
        </tbody>
      </table>
    </div>
  );
};

function getHeaders(): React.ReactNode {
  return (
    <thead id={styles.headers}>
      <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>HEX VALUE</th>
        <th>COUNT</th>
        <th>CYCLE TIME</th>
      </tr>
    </thead>
  );
}

function getBoardSection(board: Board): React.ReactNode {
  return (
    <React.Fragment key={board.name}>
      <tr className={styles.boardRow}>
        <td className={styles.boardName} colSpan={5}>
          {board.name}
        </td>
      </tr>
      {getPacketRows(board.packets)}
    </React.Fragment>
  );
}

function getPacketRows(packets: Board["packets"]): React.ReactNode[] {
  return Object.values(packets).map((packet) => {
    return <PacketRow key={packet.id} packet={packet}></PacketRow>;
  });
}

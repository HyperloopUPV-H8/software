import React, { useEffect } from "react";
import styles from "@components/ConnectionsTable/ConnectionList/ConnectionList.module.scss";
import { ConnectionItem } from "@components/ConnectionsTable/ConnectionItem/ConnectionItem";
import { Connection } from "@models/Connection";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import {
  BoardConnectionsMock,
  ConnectionsMock,
} from "@components/ConnectionsTable/structs/ConnectionsMock";
import { initializeMockConnections } from "@slices/connectionsSlice";

interface Props {
  title: string;
  connections: Connection[];
  enabled?: boolean;
}
export const ConnectionList = ({
  title,
  connections,
  enabled = true,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <ul className={styles.connectionsList}>
        {connections.map((item, index) => {
          return (
            <ConnectionItem key={index} connection={item} enabled={enabled} />
          );
        })}
      </ul>
    </div>
  );
};

//   // //mock with Redux
//   // mockConnections();

// //mocks with dispatch
// const mockConnections = (): void => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     let websocketConnectionsMocks = ConnectionsMock;
//     let boardConnectionsMocks = BoardConnectionsMock;
//     let connectionsMocks = {
//       websocket: websocketConnectionsMocks,
//       board: boardConnectionsMocks,
//     };
//     dispatch(initializeMockConnections(connectionsMocks));
//   }, []);
// };

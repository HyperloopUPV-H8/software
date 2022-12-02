import React, { useEffect } from "react";
import styles from "@components/ConnectionsTable/ConnectionsList.module.scss";
import { ConnectionLine } from "./ConnectionLine";
import { Connection } from "@models/Connection";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import {
  BoardConnectionsMock,
  ConnectionsMock,
} from "@components/ConnectionsTable/structs/ConnectionsMock";
import { initializeMockConnections } from "@slices/connectionsSlice";

interface Props {
  connectionsList: Connection[];
}
//{ connectionsList }: Props
export const ConnectionsList = () => {
  const connectionsList = useSelector((state: RootState) => state.connections);

  //mock with Redux
  mockConnections();

  return (
    <div id={styles.containerMessages}>
      <ul className={styles.ulConnections}>
        {connectionsList.websocket.map((item, index) => {
          return <ConnectionLine key={index} connection={item} />;
        })}
      </ul>
      <ul className={styles.ulConnections}>
        {connectionsList.board.map((item, index) => {
          return <ConnectionLine key={index} connection={item} />;
        })}
      </ul>
    </div>
  );
};

//mocks with dispatch
const mockConnections = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    let websocketConnectionsMocks = ConnectionsMock;
    let boardConnectionsMocks = BoardConnectionsMock;
    let connectionsMocks = {
      websocket: websocketConnectionsMocks,
      board: boardConnectionsMocks,
    };
    dispatch(initializeMockConnections(connectionsMocks));
  }, []);
};

import React, { useState } from "react";
import styles from "@components/ConnectionsTable/ConnectionLine.module.scss";
import { TbPlugConnectedX, TbPlugConnected } from "react-icons/tb";
import { Connection } from "@models/Connection";

interface Props {
  connection: Connection;
  enabled: boolean;
}

export const ConnectionLine = ({ connection, enabled }: Props) => {
  return (
    <div className={enabled ? undefined : styles.connectionDisabled}>
      <div
        className={
          !enabled
            ? styles.connectionDisabled
            : connection.isConnected
            ? styles.connectionLineConnected
            : styles.connectionLineDisconnected
        }
      >
        <li className={styles.lineMsg} key={connection.name}>
          {!enabled ? (
            <TbPlugConnectedX />
          ) : connection.isConnected ? (
            <TbPlugConnected />
          ) : (
            <TbPlugConnectedX />
          )}
          <label id={styles.idMsg}>{connection.name}</label>
          <br />
        </li>
        <hr className={styles.hr} />
      </div>
    </div>
  );
};

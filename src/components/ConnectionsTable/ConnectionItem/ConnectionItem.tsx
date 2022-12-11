import React, { useState } from "react";
import styles from "@components/ConnectionsTable/ConnectionItem/ConnectionItem.module.scss";
import { TbPlugConnectedX, TbPlugConnected } from "react-icons/tb";
import { Connection } from "@models/Connection";

interface Props {
  connection: Connection;
  enabled: boolean;
}

export const ConnectionItem = ({ connection, enabled }: Props) => {
  return (
    <li
      className={`${styles.wrapper} ${
        !enabled
          ? styles.disabled
          : connection.isConnected
          ? styles.connected
          : styles.disconnected
      }`}
    >
      {!enabled ? (
        <TbPlugConnectedX />
      ) : connection.isConnected ? (
        <TbPlugConnected />
      ) : (
        <TbPlugConnectedX />
      )}
      <div className={styles.id}>{connection.name}</div>
    </li>
  );
};

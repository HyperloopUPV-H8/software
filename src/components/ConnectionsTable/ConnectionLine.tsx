import React, { useState } from "react";
import styles from "@components/ConnectionsTable/ConnectionLine.module.scss";
import {TbPlugConnectedX, TbPlugConnected} from 'react-icons/tb';
import { Connection } from "@models/Connection";


interface Props {
    connection: Connection
}

export const ConnectionLine = ({ connection }: Props) => {

    return (
        <div className={connection.isConnected? styles.connectionLineConnected: styles.connectionLineDisconnected}>
        <li className={styles.lineMsg} key={connection.name}>
            {connection.isConnected? <TbPlugConnected/>:<TbPlugConnectedX/>}
            <label id={styles.idMsg}>{connection.name}</label>           
            <br />
        </li>
            <hr className={styles.hr}/>
        </div>
    )

}
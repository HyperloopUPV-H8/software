import React, { useState } from "react";
import { Connection } from "@components/ConnectionsTable/structs/Connection";
import styles from "@components/ConnectionsTable/ConnectionLine.module.scss";
import {TbPlugConnectedX, TbPlugConnected} from 'react-icons/tb';


interface Props {
    connection: Connection
}

export const ConnectionLine = ({ connection }: Props) => {

    return (
        <div className={connection.connected? styles.connectionLineConnected: styles.connectionLineDisconnected}>
        <li className={styles.lineMsg} key={connection.id}>
            {connection.connected? <TbPlugConnected/>:<TbPlugConnectedX/>}
            <label id={styles.idMsg}>{connection.id}: </label>
            <label id={styles.descMsg}>{connection.desc}</label>
            
            <br />
        </li>
            <hr className={styles.hr}/>
        </div>
    )

}
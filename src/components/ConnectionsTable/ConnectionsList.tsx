import React from "react";
import styles from "@components/ConnectionsTable/ConnectionsList.module.scss";
import { ConnectionLine } from "./ConnectionLine";
import { Connection } from "@models/Connection";

interface Props {
    connectionsList: Connection[],
}

export const ConnectionsList = ({connectionsList}: Props) =>{
    return (
        <div id={styles.containerMessages}>
            <ul className={styles.ulConnections}>{connectionsList.map((item, index) => {
                return (
                    <ConnectionLine key={index} connection={item}/>
                )
            })
            }</ul>
        </div>
    )
}
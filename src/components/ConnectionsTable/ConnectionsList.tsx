import React from "react";
import styles from "@components/ConnectionsTable/ConnectionsList.module.scss";
import { Connection } from "@components/ConnectionsTable/structs/Connection";
import { ConnectionLine } from "./ConnectionLine";

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
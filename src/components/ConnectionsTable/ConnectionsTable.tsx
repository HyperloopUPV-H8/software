import React, { useState } from "react";
import { ConnectionsMock } from "@components/ConnectionsTable/structs/ConnectionsMock";
import { ConnectionsList } from "@components/ConnectionsTable/ConnectionsList";
import { Connection } from "@models/Connection";



export const ConnectionsTable = () => {

    const [Connections, setConnections] = useState<Connection[]>(ConnectionsMock);

    return (
        <>
            <ConnectionsList connectionsList={Connections}/>
        </>
    )

}
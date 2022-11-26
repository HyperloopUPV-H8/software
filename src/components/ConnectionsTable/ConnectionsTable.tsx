import React, { useState } from "react";
import { Connection } from "@components/ConnectionsTable/structs/Connection";
import { ConnectionsMock } from "@components/ConnectionsTable/structs/ConnectionsMock";
import { ConnectionsList } from "@components/ConnectionsTable/ConnectionsList";



export const ConnectionsTable = () => {

    const [Connections, setConnections] = useState<Connection[]>(ConnectionsMock);

    return (
        <>
            <ConnectionsList connectionsList={Connections}/>
        </>
    )

}
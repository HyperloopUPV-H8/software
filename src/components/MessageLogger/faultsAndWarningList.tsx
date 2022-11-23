import React, { useState } from "react";
import { ConsoleList } from "@components/MessageLogger/ConsoleList";
import { Message } from "@components/MessageLogger/structs/Message";
import { warningMessages, faultMessages } from "@components/MessageLogger/MessagesMock";


export const FaultsAndWarningList = () => {

    const [WarningList, setWarningList] = useState<Message[]>(warningMessages);
    const [FaultList, setFaultList] = useState<Message[]>(faultMessages);

    return (
        <>
            <ConsoleList title={"WARNINGS"} messages={WarningList} />
            <ConsoleList title={"FAULTS"} messages={FaultList} />
        </>
    )

}
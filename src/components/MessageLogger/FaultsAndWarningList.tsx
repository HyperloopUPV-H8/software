import React, { useState } from "react";
import { ConsoleList } from "@components/MessageLogger/ConsoleList";
import { Message } from "@components/MessageLogger/structs/Message";
import { warningMessages, faultMessages } from "@components/MessageLogger/messagesMock";
import { RootState } from "store";
import { useSelector } from "react-redux";



export const FaultsAndWarningList = () => {

    const [WarningList, setWarningList] = useState<Message[]>(warningMessages);
    const [FaultList, setFaultList] = useState<Message[]>(faultMessages);

    const messages = useSelector((state: RootState) => state.messages);
    const warningList = messages.warning;
    const faultList = messages.fault;

    return (
        <>
            <ConsoleList title={"WARNINGS"} messages={WarningList} />
            <ConsoleList title={"FAULTS"} messages={FaultList} />
        </>
    )

}
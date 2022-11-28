import React, { useEffect, useState } from "react";
import { ConsoleList } from "@components/MessageLogger/ConsoleList";
import { warningMessages, faultMessages } from "@components/MessageLogger/messagesMock";
import { RootState } from "store";
import { useSelector } from "react-redux";
import { Message } from "@adapters/Message";



export const FaultsAndWarningList = () => {

    //this state is for the mocks
    // const [WarningList, setWarningList] = useState<Message[]>(warningMessages);
    // const [FaultList, setFaultList] = useState<Message[]>(faultMessages);

    // var warningList: Message[] = [];
    // var faultList: Message[] = [];
    // useEffect(() => {
        const messages = useSelector((state: RootState) => state.messages);
        const warningList = messages.warning as Message[];
        console.log(warningList)
        const faultList = messages.fault;
        console.log(faultList)
    // }, []);
    

    return (
        <>
            <ConsoleList title={"WARNINGS"} messages={warningList} />
            <ConsoleList title={"FAULTS"} messages={faultList} />
        </>
    )

}
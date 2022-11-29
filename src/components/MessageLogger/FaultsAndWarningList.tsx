import React, { useEffect, useState } from "react";
import { ConsoleList } from "@components/MessageLogger/ConsoleList";
import { warningMessages, faultMessages } from "@components/MessageLogger/messagesMock";
import { RootState } from "store";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "@adapters/Message";
import { initializeMockFaultMessages, initializeMockWarningMessages } from "@slices/messagesSlice";



export const FaultsAndWarningList = () => {

    //this state is for the static mocks
    // const [WarningList, setWarningList] = useState<Message[]>(warningMessages);
    // const [FaultList, setFaultList] = useState<Message[]>(faultMessages);

    const messages = useSelector((state: RootState) => state.messages);
    

    return (
        <>
            <ConsoleList title={"WARNINGS"} messages={messages.warning} />
            <ConsoleList title={"FAULTS"} messages={messages.fault} />
        </>
    )

}

//mocks with dispatch
const mockMessages = (): void => {
    const dispatch = useDispatch();
    
    //useEffect(() => { //with useEffect it doesn't work correctly (and with StrictMode)
      let warningMsgs = warningMessages;
      dispatch(initializeMockWarningMessages(warningMsgs)); //se ejecuta dos veces, renderiza cuando toavía no tiene valor
      let faultMsgs = faultMessages; 
      dispatch(initializeMockFaultMessages(faultMsgs));
    //}, []);
}
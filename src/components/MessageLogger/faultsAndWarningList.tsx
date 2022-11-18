import React, { useState } from "react";
import { ConsoleList } from "@components/MessageLogger/ConsoleList";
import { Message } from "@components/MessageLogger/structs/Message";


export const FaultsAndWarningList = () => {
    var warningMessages: Message[] = [{ id: "1", desc: "Warning: Each child in a list should have a unique key prop" }, 
                                    { id: "1", desc: "Warning: Each child in a list should have a unique key prop" }, 
                                    { id: "1", desc: "Warning: Each child in a list should have a unique key prop" }, 
                                    { id: "2", desc: "Can’t perform a React state update on an unmounted component" }, 
                                    { id: "3", desc: "Adjacent JSX elements must be wrapped in an enclosing tag" },
                                    { id: "3", desc: "Adjacent JSX elements must be wrapped in an enclosing tag" },
                                    { id: "1", desc: "Warning: Each child in a list should have a unique key prop" }, 
                                    { id: "4", desc: "Warning2: Each child in a list should have a unique key prop" }, 
                                    { id: "4", desc: "Warning2: Each child in a list should have a unique key prop" }
                                ]
    var faultMessages: Message[] = [{ id: "10", desc: "Fault: Can’t perform a React state update on an unmounted component" }, 
                                    { id: "20", desc: "Fault: Each child in a list should have a unique key prop" }, 
                                    { id: "20", desc: "Fault: Each child in a list should have a unique key prop" }, 
                                    { id: "20", desc: "Fault: Each child in a list should have a unique key prop" }, 
                                    { id: "20", desc: "Fault: Each child in a list should have a unique key prop" }, 
                                    { id: "20", desc: "Fault: Each child in a list should have a unique key prop" }, 
                                    { id: "20", desc: "Fault: Each child in a list should have a unique key prop" }, 
                                    { id: "30", desc: "Fault: Adjacent JSX elements must be wrapped in an enclosing tag" }]
    const [WarningList, setWarningList] = useState<Message[]>(warningMessages);
    const [FaultList, setFaultList] = useState<Message[]>(faultMessages);

    return (
        <>
            <ConsoleList title={"WARNINGS"} messages={WarningList} />
            <ConsoleList title={"FAULTS"} messages={FaultList} />
        </>
    )

}
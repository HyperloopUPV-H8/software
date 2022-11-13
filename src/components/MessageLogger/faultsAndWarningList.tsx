import React, { useState } from "react";
import { ConsoleList } from "./consoleList";

export type Message = {
    //type: string, //F o W
    id: string,
    desc: string,

}

export const FaultsAndWarningList = () => {
    var warningMessages: Message[] = [{ id: "1", desc: "Warning: Each child in a list should have a unique key prop" }, { id: "2", desc: "Can’t perform a React state update on an unmounted component" }, { id: "3", desc: "Adjacent JSX elements must be wrapped in an enclosing tag" },
    { id: "1", desc: "Warning: Each child in a list should have a unique key prop" }]
    var faultMessages: Message[] = [{ id: "10", desc: "B" }, { id: "20", desc: "B" }, { id: "30", desc: "B" }]
    const [WarningList, setWarningList] = useState<Message[]>(warningMessages);
    const [FaultList, setFaultList] = useState<Message[]>(faultMessages);
    //var m1: Message = { id: "3", desc: "A" }

    //Si hago esto salta error porque se rerenderiza infinitas veces
    // setWarningList(prevState => (
    //     [
    //         ...prevState,
    //         m1
    //     ]
    // ));

    console.log(WarningList)
    //var titleName: string = "Hola"
    return (
        <>
            <ConsoleList title={"WARNINGS"} messages={WarningList} />
            <ConsoleList title={"FAULTS"} messages={FaultList} />
        </>
    )

}
import React, { useState } from "react";
import { Message } from "./faultsAndWarningList";
import { MessageList } from "./messageList";

interface Props {
    title: string
    messages: Message[]
}

export const ConsoleList = ({ title, messages }: Props) => {
    //const [Message, setMessage] = useState();

    return (
        <>
            <h2>{title}</h2>
            <MessageList messages={messages} />
        </>

    )

}
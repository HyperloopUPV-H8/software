import React, { useState } from "react";
import { Message } from "@components/MessageLogger/structs/Message";
import { MessageList } from "@components/MessageLogger/MessageList";

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
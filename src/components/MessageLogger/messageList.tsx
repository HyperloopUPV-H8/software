import React, { useState } from "react";
import { Message } from "./faultsAndWarningList";
import { LineMessage } from "./lineMessage";
import "./messageList.css"

interface Props {
    messages: Message[]
}

export const MessageList = ({ messages }: Props) => {
    //const [Message, setMessage] = useState();

    return (
        <div id="containerMessages">
            <ul>{messages.map(msg => {
                return (
                    <LineMessage message={msg} />
                )
            })
            }</ul>
        </div>

    )

}
import React, { useState } from "react";
import { Message } from "./faultsAndWarningList";
import { LineMessage } from "./lineMessage";
import "./messageList.css"

interface Props {
    messages: Message[]
}

export const MessageList = ({ messages }: Props) => {
    //const [Message, setMessage] = useState();

    var count: number = 0
    return (
        <div id="containerMessages">
            <ul className="lineMsg">{messages.map(msg => {
                return (
                    <LineMessage message={msg} count={count} />
                )
            })
            }</ul>
        </div>

    )

}

//It doesn`t work yet
const messagesRepeated = (messages: Message[]): number[] => {
    var counts: number[] = new Array(messages.length)
    for (let [i, el] of messages.entries()) {
        console.log(el, i)
        let index = messages.indexOf(el, i + 1)
        console.log(index)
        if (index >= 0) {
            counts[i]++
            messages.splice(index, 1)
        }
    }
    return counts
}
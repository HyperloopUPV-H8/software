import React, { useEffect, useState } from "react";
import { Message } from "./FaultsAndWarningList";
import { LineMessage } from "./LineMessage";
import "./messageList.css"

interface Props {
    messages: Message[]
}

export const MessageList = ({ messages }: Props) => {
    // const [counts, setCounts] = useState([0]);

    // useEffect(() => {
    //     setCounts(messagesRepeated(messages))
    //     console.log(messages)
    //     console.log("counts: " + counts)
    // }, [])

    var counts: number[] = messagesRepeated(messages)
    console.log(messages)
    console.log("counts: " + counts)

    return (
        <div id="containerMessages">
            <ul className="lineMsg">{messages.map((msg, index) => {
                return (
                    <LineMessage key={index} message={msg} count={counts[index]} />
                )
            })
            }</ul>
        </div>

    )

}

//It doesn`t work yet
const messagesRepeated = (messages: Message[]): (number[]) => {
    var counts: number[] = []
    for (let [i, el] of messages.entries()) {
        console.log(el)
        let count = deleteDuplicated(el.id, messages, i + 1)
        counts.push(count)

    }
    return counts
}

const deleteDuplicated = (id: string, messages: Message[], index: number): number => {
    var count: number = 1



    for (let i = index; i < messages.length; i++) {
        if (id === messages[i].id) {
            console.log("Hay repetidos")
            messages.splice(i, 1)
            count++
        }
    }
    return count
}

// const deleteDuplicated = (id: string, messages: Message[], index: number): number => {
//     var count: number = 1
//     for (let i = index; i < messages.length; i++) {
//         if (id === messages[i].id) {
//             console.log("Hay repetidos")
//             messages.splice(i, 1)
//             count++
//         }
//     }
//     return count
// }
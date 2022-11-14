import React, { useEffect, useState } from "react";
import { Message } from "@components/MessageLogger/structs/Message";
import { LineMessage } from "@components/MessageLogger/LineMessage";
import "@components/MessageLogger/MessageList.css"

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
    var finished: boolean = false

    while(!finished && index<messages.length){
        if (id === messages[index].id) {
            console.log("Hay repetidos")
            messages.splice(index, 1)
            count++
        } else{
            finished = true
        }

        index++
    }

    return count
}
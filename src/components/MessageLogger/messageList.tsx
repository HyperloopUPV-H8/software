import React, { useEffect, useState } from "react";
import { Message, MessageCounter } from "@components/MessageLogger/structs/Message";
import { LineMessage } from "@components/MessageLogger/LineMessage";
import "@components/MessageLogger/MessageList.css"

interface Props {
    messages: Message[]
}

export const MessageList = ({ messages }: Props) => {
    const [messagesWithCounts, setMessagesWithCounts] = useState([] as MessageCounter[]);

    useEffect(() => {
        //if(messagesWithCounts.length == 0){

            let contadores: number[] = messagesRepeated(messages)
            createMessagesWithCounts(contadores)
        //}
    }, [])



    const createMessagesWithCounts = (contadores: number[]): void => {
        console.log(messages)
        let items = [] as MessageCounter[];
        for(let i = 0; i < messages.length; i++){
            let item: MessageCounter = {
                msg: messages[i],
                count: contadores[i]
            }
    
            items.push(item)
            
                //console.log(item)
        }

        setMessagesWithCounts(
            [
                ...items
            ]
        );
        
        //console.log(messagesWithCounts)
    }


    console.log(messagesWithCounts)
    return (
        <div id="containerMessages">
            <ul className="lineMsgUl">{messagesWithCounts.map((item, index) => {
                return (
                    <LineMessage key={index} message={item.msg} count={item.count} />
                )
            })
            }</ul>
        </div>

    )

}


const messagesRepeated = (messages: Message[]): (number[]) => {
    let counts: number[] = []
    for (let [i, el] of messages.entries()) {
        console.log(el)
        let count = deleteDuplicated(el.id, messages, i + 1)
        counts.push(count)

    }
    return counts
}

const deleteDuplicated = (id: string, messages: Message[], index: number): number => {
    let count: number = 1
    let finished: boolean = false

    while(!finished && index < messages.length){
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


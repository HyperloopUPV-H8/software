import React, { useEffect, useState } from "react";
import { Message, MessageCounter } from "@components/MessageLogger/structs/Message";
import { LineMessage } from "@components/MessageLogger/LineMessage";
import styles from "@components/MessageLogger/MessageList.module.scss";

interface Props {
    messages: Message[]
}

export const MessageList = ({ messages }: Props) => {
    const [messagesWithCounts, setMessagesWithCounts] = useState([] as MessageCounter[]);

    useEffect(() => {
            let contadores: number[] = messagesRepeated(messages)
            createMessagesWithCounts(contadores)
    }, [])



    const createMessagesWithCounts = (contadores: number[]): void => {
        let items = [] as MessageCounter[];

        for(let i = 0, j = 0; i < messages.length && j < contadores.length; i++, j++){
            let item: MessageCounter = {
                msg: messages[i],
                count: contadores[j]
            }

            items.push(item)

            if(item.count > 1){
                //several elements mustn't be represented because they are repeated
                i += item.count-1
            }
        }

        setMessagesWithCounts(
            [
                ...items
            ]
        );
    }

    return (
        <div id={styles.containerMessages}>
            <ul className={styles.lineMsgUl}>{messagesWithCounts.map((item, index) => {
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
    let count: number = 1

    for(let i = 0; i < messages.length; i++){
        let el = messages[i]
        if(i < messages.length - 1){
            count = checkDuplicated(el.id, messages, i + 1)
        } else{
            //if it is in the last element it is because is alone
            count = 1 
        }
        
        counts.push(count)
        if(count > 1){
            //several elements mustn't be counted because they are repeated
            i += count-1
        }
    } 
    return counts
}

const checkDuplicated = (id: string, messages: Message[], index: number): number => {
    let count: number = 1
    let finished: boolean = false

    while(!finished && index < messages.length){
        if (id === messages[index].id) {
            count++
        } else{
            finished = true
        }

        index++
    }

    return count
}


import React, { useState } from "react";
import { Message } from "@components/MessageLogger/structs/Message";
import styles from "@components/MessageLogger/LineMessage.module.scss"


interface Props {
    message: Message
    count: number
}

export const LineMessage = ({ message, count }: Props) => {
    const [isSelected, setIsSelected] = useState(false)

    const dropDownLine = ()  => {
        setIsSelected(current => !current);
        
    }

    return (
        <>
        <li className={styles.lineMsg} key={message.id}  style={{
                whiteSpace: isSelected ? 'normal' : 'nowrap'
            }}>
            <img id={styles.dropDownArrow} src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.6.3/collection/icon/svg/ios-arrow-dropdown-circle.svg" onClick={dropDownLine} style={{
                transform: isSelected ? 'none' : 'rotate(270deg)'
            }}/>
            <label id={styles.idMsg}>{message.id}: </label>
            {count > 1 ? <label id={styles.count}>{count}</label> : null}
            <label id={styles.descMsg}>{message.desc}</label>
            <br />
        </li>
            <hr className={styles.hr}/>
            </>
    )

}
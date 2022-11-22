import React, { useState } from "react";
import { Message } from "@components/MessageLogger/structs/Message";
import styles from "@components/MessageLogger/LineMessage.module.scss"
import logo from "./arrow-dropdown-circle.svg"

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
            <img id={styles.dropDownArrow} src={logo} onClick={dropDownLine} style={{
                transform: isSelected ? 'rotate(270deg)' : 'none'
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
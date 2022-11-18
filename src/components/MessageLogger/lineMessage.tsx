import React, { useState } from "react";
import { Message } from "@components/MessageLogger/structs/Message";
import "@components/MessageLogger/LineMessage.css"
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
        <li className="lineMsg" key={message.id}  style={{
                whiteSpace: isSelected ? 'normal' : 'nowrap'
            }}>
            <img id="drop-down-arrow" src={logo} onClick={dropDownLine} />
            {count > 1 ? <label id="count">{count}</label> : null}
            <label id="idMsg">{message.id}: </label>
            <label id="descMsg">{message.desc}</label>
            <br />
        </li>
            <hr className="hr"/>
            </>
    )

}
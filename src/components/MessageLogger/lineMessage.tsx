import React, { useState } from "react";
import { Message } from "./FaultsAndWarningList";
import "./lineMessage.css"
import logo from "./arrow-dropdown-circle.svg"

interface Props {
    message: Message
    count: number
}

export const LineMessage = ({ message, count }: Props) => {

    return (
        <li className="lineMsg" key={message.id}>
            <img id="drop-down-arrow" src={logo} onClick={dropDownLine} />
            {count > 1 ? <label id="count">{count}</label> : null}
            <label id="idMsg">{message.id}: </label>
            <label>{message.desc}</label>
            <br />
            <hr />
        </li>
    )

}

const dropDownLine = (): void => {
    console.log("Implementar línea despleagable")
}

const showCounter = (count: number, setShowCount: React.Dispatch<React.SetStateAction<boolean>>): void => {
    if (count > 0) {
        setShowCount(true)
    }
}

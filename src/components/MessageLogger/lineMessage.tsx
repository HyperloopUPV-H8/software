import React, { useState } from "react";
import { Message } from "./faultsAndWarningList";
import "./lineMessage.css"
import logo from "./arrow-dropdown-circle.svg"

interface Props {
    message: Message
    count: number
}

export const LineMessage = ({ message, count }: Props) => {
    //id="drop-down-arrow"
    const dropDownLine = (): void => {
        console.log("Implementar línea despleagable")
    }
    return (
        <li className="lineMsg">
            <img id="drop-down-arrow" src={logo} onClick={dropDownLine} />
            <label id="count">{count}</label>
            <label id="idMsg">{message.id}: </label>
            <label>{message.desc}</label>
            <br />
            <hr />
        </li>
    )

}
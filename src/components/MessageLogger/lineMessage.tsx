import React, { useState } from "react";
import { Message } from "./faultsAndWarningList";
import "./lineMessage.css"
import logo from "./arrow-dropdown-circle.svg"

interface Props {
    message: Message
}

export const LineMessage = ({ message }: Props) => {
    //id="drop-down-arrow"
    const dropDownLine = (): void => {
        console.log("Implementar línea despleagable")
    }
    return (
        <li>
            <img id="drop-down-arrow" src={logo} onClick={dropDownLine} />
            <label id="idMsg"> {message.id}: </label>
            <label>{message.desc}</label>
            <br />
            <hr />
        </li>
    )

}
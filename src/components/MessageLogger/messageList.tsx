import React, { useEffect, useState } from "react";
import { Message, MessageCounter } from "@components/MessageLogger/structs/Message";
import { LineMessage } from "@components/MessageLogger/LineMessage";
import styles from "@components/MessageLogger/MessageList.module.scss";

interface Props {
    messages: MessageCounter[]
}

export const MessageList = ({ messages }: Props) => {

    return (
        <div id={styles.containerMessages}>
            <ul className={styles.lineMsgUl}>{messages.map((item, index) => {
                return (
                    <LineMessage key={index} message={item.msg} count={item.count} />
                )
            })
            }</ul>
        </div>

    )

}





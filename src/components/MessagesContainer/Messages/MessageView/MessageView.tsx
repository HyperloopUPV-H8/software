import styles from "./MessageView.module.scss";
import React from "react";
import { Counter } from "./Counter/Counter";
import { Message } from "common";
import { ReactComponent as Warning } from "assets/svg/warning.svg";
import { ReactComponent as Fault } from "assets/svg/fault.svg";
import { Origin } from "./Origin/Origin";
import { TimestampView } from "./TimestampView/TimestampView";
import { Content } from "./Content/Content";

type Props = {
    message: Message;
};

export const MessageView = React.memo(({ message }: Props) => {
    const Icon = message.kind == "warning" ? Warning : Fault;

    const appearance = message.kind == "fault" ? styles.fault : styles.warning;

    return (
        <article className={`${styles.message} ${appearance}`}>
            <Icon className={styles.icon} />
            <div className={styles.kindAndOrigin}>
                <div className={styles.protectionKind}>
                    {message.protection.kind}
                </div>
                <Origin
                    className={styles.origin}
                    board={message.board}
                    name={message.name}
                />
            </div>
            <Counter
                className={styles.counter}
                count={message.count}
            />
            <Content
                message={message}
                className={styles.content}
            />
            <TimestampView
                className={styles.timestamp}
                timestamp={message.timestamp}
            />
        </article>
    );
});

import styles from "./MessageView.module.scss";
import { Counter } from "./Counter/Counter";
import { ProtectionMessage } from "models/ProtectionMessage";
import { ReactComponent as Warning } from "assets/svg/warning.svg";
import { ReactComponent as Fault } from "assets/svg/fault.svg";

import React from "react";
import { ViolationView } from "./ViolationView/ViolationView";
import { Origin } from "./Origin/Origin";
import { TimestampView } from "./TimestampView/TimestampView";

type Props = {
    message: ProtectionMessage;
};

export const MessageView = React.memo(({ message }: Props) => {
    const Icon = message.kind == "warning" ? Warning : Fault;

    return (
        <article
            className={`${styles.message} ${
                message.kind == "fault" ? styles.fault : styles.warning
            }`}
        >
            <Icon className={styles.icon} />
            <div className={styles.kindAndOrigin}>
                <div className={styles.violationKind}>
                    {message.violation.kind}
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
            <ViolationView
                className={styles.violation}
                violation={message.violation}
            />
            <TimestampView
                className={styles.timestamp}
                timestamp={message.timestamp}
            />
        </article>
    );
});

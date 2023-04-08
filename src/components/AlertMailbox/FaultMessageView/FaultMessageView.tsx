import styles from "./FaultMessageView.module.scss";

import { FaultMessage } from "models/AlertMessage";
import { Badge } from "components/Badge/Badge";
import { ViolationView } from "./ViolationView/ViolationView";
import React from "react";

type Props = {
    message: FaultMessage;
};

export const FaultMessageView = React.forwardRef<HTMLElement, Props>(
    ({ message }: Props, ref) => {
        return (
            <article
                ref={ref}
                className={styles.faultMessageViewWrapper}
            >
                <div className={styles.title}>
                    <div className={styles.valueName}>
                        {message.msg.valueName}
                    </div>
                    <Badge
                        label={message.msg.violation.kind}
                        color={"#fca7a7"}
                    />
                </div>
                <ViolationView violation={message.msg.violation} />
            </article>
        );
    }
);

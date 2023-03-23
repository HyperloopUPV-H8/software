import { WarningMessage } from "models/AlertMessage";
import styles from "./WarningMessageView.module.scss";
import React from "react";
type Props = {
    message: WarningMessage;
};

export const WarningMessageView = React.forwardRef<HTMLElement, Props>(
    ({ message }: Props, ref) => {
        return (
            <article
                ref={ref}
                className={styles.warningMessageViewWrapper}
            >
                warning message view
            </article>
        );
    }
);

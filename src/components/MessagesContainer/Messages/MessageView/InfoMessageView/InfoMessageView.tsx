import styles from "./InfoMessageView.module.scss";

import { InfoMessage } from "common";

type Props = {
    message: InfoMessage;
    className: string;
};

export const InfoMessageView = ({ message, className }: Props) => {
    return (
        <div className={`${styles.infoMessageView} ${className}`}>
            <div className={styles.board}>{message.board}</div>
            <div>{message.msg}</div>
        </div>
    );
};

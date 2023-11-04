import { Timestamp } from "../../../../..";
import styles from "./TimestampView.module.scss";

type Props = {
    timestamp: Timestamp;
    className: string;
};

export const TimestampView = ({ timestamp, className }: Props) => {
    return (
        <div className={`${styles.timestamp} ${className}`}>
            {getTimestampString(timestamp)}
        </div>
    );
};

function getTimestampString(timestamp: Timestamp): string {
    return `${timestamp.hour}:${timestamp.minute}:${timestamp.second} ${timestamp.day}/${timestamp.month}/${timestamp.year}`;
}

import styles from "components/FaultsAndWarningLogger/MessageLogger/MessageList/MessageItem/Counter/Counter.module.scss";

interface Props {
    count: number;
    className: string;
}

export const Counter = ({ count, className }: Props) => {
    return <div className={`${styles.count} ${className}`}>{count}</div>;
};

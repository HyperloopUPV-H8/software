import styles from "./Item.module.scss";

type Props = {
    value: string;
    onClick: (value: string) => void;
};

export const Item = ({ value, onClick }: Props) => {
    return (
        <div
            className={styles.itemWrapper}
            onClick={() => onClick(value)}
        >
            <span className={styles.label}>{value}</span>
        </div>
    );
};

import styles from "./Label.module.scss";

type Props = {
    className: string;
    label: string;
};

export const Label = ({ className, label }: Props) => {
    return (
        <div className={`${styles.label} ${className}`}>
            {label} <div className={styles.circle}></div>
        </div>
    );
};

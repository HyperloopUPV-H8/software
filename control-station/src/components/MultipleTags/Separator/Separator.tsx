import styles from "./Separator.module.scss";

export const Separator = () => {
    return (
        <div className={styles.separatorWrapper}>
            <div className={styles.line}></div>
        </div>
    );
};

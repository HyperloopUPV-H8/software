import styles from "./CameraTitle.module.scss";

type Props = {
    title: string;
};

export const CameraTitle = ({ title }: Props) => {
    return (
        <div className={styles.title}>
            <div className={styles.name}>{title}</div>
            <div className={styles.dot}></div>
        </div>
    );
};

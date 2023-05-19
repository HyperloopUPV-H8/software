import styles from "./Title.module.scss";

type Props = {
    title: string;
};

export const Title = ({ title }: Props) => {
    return <div className={styles.title}>{title}</div>;
};

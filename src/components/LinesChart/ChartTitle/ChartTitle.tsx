import styles from "./ChartTitle.module.scss";

type Props = {
    title: string;
};

export const ChartTitle = ({ title }: Props) => {
    return <span className={styles.title}>{title}</span>;
};

import styles from "./Title.module.scss";
import { memo } from "react";
type Props = {
    title: string;
};

const Title = ({ title }: Props) => {
    return <span className={styles.title}>{title}</span>;
};

export default memo(Title);

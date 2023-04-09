import styles from "./CameraTitle.module.scss";
import { HTMLAttributes } from "react";
type Props = {
    title: string;
} & HTMLAttributes<HTMLDivElement>;

export const CameraTitle = ({ title, ...props }: Props) => {
    const className = `${styles.title} ${props.className ?? ""}`;

    return (
        <div
            {...props}
            className={className}
        >
            <div className={styles.name}>{title}</div>
            <div className={styles.dot}></div>
        </div>
    );
};

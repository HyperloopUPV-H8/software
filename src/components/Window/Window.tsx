import styles from "components/Window/Window.module.scss";

type Props = {
    title: string;
    children?: React.ReactNode;
};

export const Window = ({ title, children }: Props) => {
    return (
        <article className={styles.windowWrapper}>
            <header className={styles.header}>{title}</header>
            <div className={styles.content}>{children}</div>
        </article>
    );
};

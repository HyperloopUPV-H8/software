import styles from 'components/Window/Window2.module.scss';

type Props = {
    title: string;
    children?: React.ReactNode;
    className?: string;
};

export const Window2 = ({ title, children, className }: Props) => {
    return (
        <article className={`${styles.window} ${className}`}>
            <header className={styles.header}>{title}</header>
            <div className={styles.content}>{children}</div>
        </article>
    );
};
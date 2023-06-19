import styles from "./PageWrapper.module.scss";

type Props = {
    title: string;
    children?: React.ReactNode;
};

export const PageWrapper = ({ title, children }: Props) => {
    //FIXME: Quit from common
    return (
        <main className={styles.pageWrapper}>
            <header className={styles.header}>
                <h1>{title}</h1>
            </header>
            <div className={styles.content}>{children}</div>
        </main>
    );
};

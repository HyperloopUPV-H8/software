import styles from "@layouts/SplitLayout/Component/Component.module.scss";

type Props = {
    component: React.ReactNode;
    normalizedLength: number;
};

export const Component = ({ component, normalizedLength }: Props) => {
    return (
        <div
            className={styles.wrapper}
            style={{
                flexBasis: `${normalizedLength * 100}%`,
            }}
        >
            {component}
        </div>
    );
};

import styles from "@layouts/SplitLayout/Component/Component.module.scss";

type Props = {
    component: React.ReactNode;
    normalizedPortion: number;
};

export const Component = ({ component, normalizedPortion }: Props) => {
    return (
        <div
            className={styles.wrapper}
            style={{
                flexBasis: `${normalizedPortion * 100}%`,
            }}
        >
            {component}
        </div>
    );
};

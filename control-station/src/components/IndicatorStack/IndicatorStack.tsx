import styles from "./IndicatorStack.module.scss"

interface Props {
    children: React.ReactNode;
}

export const IndicatorStack = ({children}: Props) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}

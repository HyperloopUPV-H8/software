import styles from "./BatteryConnector.module.scss"

interface Props {
    rotate?: boolean
}

export const BatteryConnector = ({ rotate }: Props) => {

    return (
        <div 
            className={styles.background}
            style={{ transform: rotate ? "rotate(180deg)" : "" }}
        >
            <div className={styles.point}></div>
            <div className={styles.point}></div>
        </div>
    )
}

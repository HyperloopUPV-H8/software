import styles from "./LogItem.module.scss"
import folderClosed from "assets/svg/folder-closed.svg"

interface Props {
    logName: string;
}

export const LogItem = ({logName}: Props) => {
    return (
        <div className={styles.logItemWrapper}>
            <div className={styles.icon}>
                <img src={folderClosed} alt="log-icon" />
            </div>
            <div className={styles.title}>
                <p>
                    {logName}
                </p>
            </div>
        </div>
    )
}

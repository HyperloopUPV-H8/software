import { ChartsColumn } from "pages/LoggerPage/ChartsColumn/ChartsColumn";
import { LogsColumn } from "./LogsColumn/LogsColumn";
import styles from "./LoggerPage.module.scss";

export const LoggerPage = () => {
    return (
        <div className={styles.LoggerPage}>
            <div className={styles.LogsColumn}>
                <LogsColumn />
            </div>
            <div className={styles.ChartsColumn}>
                <ChartsColumn />
            </div>
        </div>
    );
};

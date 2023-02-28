import styles from "components/Logger/Logger.module.scss";
import { BsFillPlayFill } from "react-icons/bs";
import { BsFillStopFill } from "react-icons/bs";
import { useState, useContext } from "react";
import { useLogger } from "./useLogger";

export const Logger = () => {
    const [loggingState, setLoggingState] = useState(false);
    const [startLogging, stopLogging] = useLogger();
    return (
        <div className={`${styles.loggerWrapper} island`}>
            <span className={styles.loggingState}>
                Logging: {`${loggingState}`}
            </span>
            <div className={styles.buttons}>
                <div
                    className={styles.playBtn}
                    onClick={() => {
                        startLogging();
                    }}
                >
                    <BsFillPlayFill />
                </div>
                <div
                    className={styles.stopBtn}
                    onClick={() => {
                        stopLogging();
                    }}
                >
                    <BsFillStopFill />
                </div>
            </div>
        </div>
    );
};

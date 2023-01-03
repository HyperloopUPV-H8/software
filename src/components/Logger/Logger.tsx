import styles from "@components/Logger/Logger.module.scss";
import { BsFillPlayFill } from "react-icons/bs";
import { BsFillStopFill } from "react-icons/bs";
import { useState, useContext } from "react";
import loggerService from "@services/LoggerService";

export const Logger = () => {
    const [loggingState, setLoggingState] = useState(false);

    return (
        <div className={styles.loggerWrapper}>
            <span className={styles.loggingState}>
                Logging: {`${loggingState}`}
            </span>
            <div className={styles.buttons}>
                <div
                    className={styles.playBtn}
                    onClick={() => {
                        loggerService.startLogging().then((success) => {
                            setLoggingState(success);
                        });
                    }}
                >
                    <BsFillPlayFill />
                </div>
                <div
                    className={styles.stopBtn}
                    onClick={() => {
                        loggerService.stopLogging().then((success) => {
                            setLoggingState(!success);
                        });
                    }}
                >
                    <BsFillStopFill />
                </div>
            </div>
        </div>
    );
};

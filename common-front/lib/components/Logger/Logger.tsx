import styles from "./Logger.module.scss";
import { useLogger } from "./useLogger";
import { Button } from "..";

export const Logger = () => {
    const [state, startLogging, stopLogging] = useLogger();
    return (
        <div className={styles.logger}>
            <span className={styles.state}>Logging: {`${state}`}</span>
            <div className={styles.buttons}>
                <Button
                    label="Start"
                    color="hsl(116, 38%, 50%)"
                    onClick={() => {
                        startLogging();
                    }}
                ></Button>
                <Button
                    label="Stop"
                    color="hsl(0, 77%, 53%)"
                    onClick={() => {
                        stopLogging();
                    }}
                ></Button>
            </div>
        </div>
    );
};

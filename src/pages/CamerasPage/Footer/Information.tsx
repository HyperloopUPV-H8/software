import styles from "./Information.module.scss";

export const Information = () => {
    return (
        <div className={styles.informationContainer}>
            <div>Information</div>
            <div className={styles.measurementLine}>
                <div>Position:</div>
                <div>17</div>
                <div>m</div>
            </div>
            <div className={styles.measurementLine}>
                <div>Speed:</div>
                <div>28</div>
                <div>km/h</div>
            </div>
        </div>
    );
};

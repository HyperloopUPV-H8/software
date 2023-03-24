import styles from "./Information.module.scss";

export const Information = () => {
    //TODO: Add the information with the useSelector
    return (
        <div className={styles.informatioWrapper}>
            <div className={styles.title}>Information</div>
            <div className={styles.measurementLine}>
                <span>Position:</span>
                <span>17 m</span>
            </div>
            <div className={styles.measurementLine}>
                <span>Speed:</span>
                <span>28 km/h</span>
            </div>
        </div>
    );
};

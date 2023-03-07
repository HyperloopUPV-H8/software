import styles from "./Information.module.scss";

type Props = {
    className: string;
};

// {className}:Props

export const Information = () => {
    return (
        <div className={styles.informatioWrapper}>
            <div className={styles.title}>Information</div>
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

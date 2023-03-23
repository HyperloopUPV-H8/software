import styles from "./Kenos.module.scss";

export const Kenos = () => {
    //TODO: Add the useSelector and create the porcentage with the total, warningRange
    let leftPosition = "80%";

    const positionKenos = {
        left: leftPosition,
    } as React.CSSProperties;

    return <div className={styles.kenos} style={positionKenos} />;
};

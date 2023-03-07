import styles from "./Tube.module.scss";
import logo from "./Artboard41.png";

export const Tube = () => {
    return (
        <div className={styles.tube}>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <img src={logo} className={styles.logo}></img>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
        </div>
    );
};

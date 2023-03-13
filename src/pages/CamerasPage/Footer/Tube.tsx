import styles from "./Tube.module.scss";
import logo from "./Artboard41.png";
import { ReactComponent as TeamLogo } from "assets/svg/teamLogo.svg";
import { Kenos } from "./Kenos";

export const Tube = () => {
    return (
        <div className={styles.tube}>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <div className={styles.leftSection}></div>
            <div className={styles.section}>
                <TeamLogo className={styles.logo} />
            </div>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
            <div className={styles.rightSection}></div>
            <Kenos />
        </div>
    );
};

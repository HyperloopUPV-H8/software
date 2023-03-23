import styles from "./Tube.module.scss";
import { ReactComponent as TeamLogo } from "assets/svg/team_logo.svg";
import { Kenos } from "./Kenos/Kenos";

const SECTIONS_BY_SIDE = 6;

export const Tube = () => {
    const sectionsArray = new Array(SECTIONS_BY_SIDE);
    sectionsArray.fill(0);

    return (
        <div className={styles.tube}>
            {sectionsArray.map(() => {
                return <div className={styles.leftSection} />;
            })}
            <div className={styles.section}>
                <TeamLogo className={styles.logo} />
            </div>
            {sectionsArray.map(() => {
                return <div className={styles.rightSection} />;
            })}
            <Kenos />
        </div>
    );
};

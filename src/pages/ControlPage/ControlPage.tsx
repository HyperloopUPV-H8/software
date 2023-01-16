import styles from "pages/ControlPage/ControlPage.module.scss";
import { PneumaticsSection } from "components/PneumaticsSection/PneumaticsSection";
export const ControlPage = () => {
    return (
        <main className={styles.controlPageWrapper}>
            <PneumaticsSection />
        </main>
    );
};

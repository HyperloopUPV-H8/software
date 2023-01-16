import styles from "components/PneumaticsSection/PneumaticsSection.module.scss";
import { ValueTag } from "components/ValueTag/ValueTag";
import { useFetchGUISection } from "./useFetchGUISection";
export const PneumaticsSection = () => {
    const pneumaticsProperties = useFetchGUISection("pneumatics");

    return (
        <section className={styles.controlSectionWrapper}>
            <ValueTag />
            <ValueTag />
            <ValueTag />
            <ValueTag />
            <ValueTag />
            <ValueTag />
        </section>
    );
};

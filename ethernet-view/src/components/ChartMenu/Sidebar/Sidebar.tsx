import styles from "./Sidebar.module.scss";
import { Section } from "./Section/Section";
import { memo } from "react";

type Props = {
    sections?: Section[];
    elements?: string[];
};

const Sidebar = ({ sections, elements }: Props) => {

    return sections && sections.length > 0 ?
    (
        <div className={styles.sidebar}>
            {sections.map((section) => {
                return (
                    <Section
                        key={section.name}
                        section={section}
                    />
                );
            })}
        </div>
    ) : (elements && elements.length > 0 ? (
        <div className={styles.sidebar}>
            {elements.map((element) => {
                return (
                    <div key={element} className={styles.subsection}>
                        <div className={styles.name}>{element}</div>
                    </div>
                );
            })}
        </div>
    ) : null);

};

export default memo(Sidebar);

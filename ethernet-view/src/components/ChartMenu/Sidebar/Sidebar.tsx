import styles from "./Sidebar.module.scss";
import { Section } from "./Section/Section";
import { memo } from "react";

type Props = {
    sections: Section[];
};

const Sidebar = ({ sections }: Props) => {
    return (
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
    );
};

export default memo(Sidebar);

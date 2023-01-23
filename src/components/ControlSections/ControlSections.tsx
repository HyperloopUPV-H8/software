import styles from "components/ControlSections/ControlSections.module.scss";
import { useState } from "react";
import { PneumaticsSection } from "components/ControlSections/PneumaticsSection/PneumaticsSection";
import { ControlData } from "components/ControlSections/types/ControlData";
import { NavigationSection } from "components/ControlSections/NavigationSection/NavigationSection";
type Props = {
    controlData: ControlData;
};

export const ControlSections = ({ controlData }: Props) => {
    return (
        <section className={styles.podSectionsWrapper}>
            <PneumaticsSection pneumaticsData={controlData.pneumaticsData} />
            <NavigationSection
                navigationData={controlData.navigationData}
            ></NavigationSection>
        </section>
    );
};

import styles from "components/ControlSections/PneumaticsSection/PneumaticsSection.module.scss";
import { ValueTag } from "components/ValueTag/ValueTag";
import {
    PneumaticsProperties,
    PneumaticsData,
} from "components/ControlSections/PneumaticsSection/PneumaticsData";

type Props = {
    pneumaticsData: PneumaticsData;
};

export const PneumaticsSection = ({ pneumaticsData }: Props) => {
    return (
        <section className={styles.pneumaticsSectionWrapper}>
            <ValueTag measurement={pneumaticsData.bottle1} />
            <ValueTag measurement={pneumaticsData.bottle2} />
            <ValueTag measurement={pneumaticsData.highPressure} />
            <ValueTag measurement={pneumaticsData.midPressure} />
            <ValueTag measurement={pneumaticsData.lowPressure} />
            <div className={styles.otherTags}>
                {pneumaticsData.additionalValues.map((measurement) => {
                    return (
                        <ValueTag
                            key={measurement.name}
                            measurement={measurement}
                        />
                    );
                })}
            </div>
        </section>
    );
};

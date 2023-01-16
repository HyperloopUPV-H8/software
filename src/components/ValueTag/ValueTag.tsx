import styles from "components/ValueTag/ValueTag.module.scss";
import { ValueName } from "components/ValueTag/ValueName/ValueName";
import { ValueNumber } from "components/ValueTag/ValueNumber/ValueNumber";

export const ValueTag = () => {
    return (
        <article className={styles.valueTagWrapper}>
            <ValueName name="Test Name" />
            <ValueNumber number={12} />
        </article>
    );
};

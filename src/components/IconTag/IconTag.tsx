import styles from "./IconTag.module.scss";
import { Measurement } from "common";
import { ValueData } from "components/ValueData/ValueData";
type Props = {
    icon: React.ReactNode;
    measurement: Measurement;
};

export const IconTag = ({ icon, measurement }: Props) => {
    return (
        <article className={styles.iconTagWrapper}>
            {icon}
            <ValueData measurement={measurement} />
        </article>
    );
};

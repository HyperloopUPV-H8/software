import { Measurement } from "models/PodData/Measurement";
import { Bar, BarType } from "./Bar/Bar";
import { ValueData } from "components/ValueData/ValueData";
import styles from "./BarTag.module.scss";
type Props = {
    measurement: Measurement;
    barType: BarType;
    showWrapper?: boolean;
};

export const BarTag = ({
    measurement,
    barType,
    showWrapper = false,
}: Props) => {
    return (
        <article
            className={`${styles.barTagWrapper} ${
                showWrapper ? "tagWrapper" : ""
            }`}
        >
            <Bar
                type={barType}
                value={measurement.value as number}
                max={100}
                min={0}
            />
            <ValueData measurement={measurement} />
        </article>
    );
};

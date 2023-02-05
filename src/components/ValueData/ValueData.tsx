import styles from "components/ValueData/ValueData.module.scss";
import { ValueName } from "components/ValueData/ValueName/ValueName";
import { ValueNumber } from "components/ValueData/ValueNumber/ValueNumber";
import { Measurement } from "models/PodData/Measurement";

type Props = {
    measurement: Measurement;
};

export const ValueData = ({ measurement }: Props) => {
    return (
        <div className={styles.valueDataWrapper}>
            <ValueName name={measurement.name} />
            <ValueNumber
                value={measurement.value}
                type={measurement.type}
            />
        </div>
    );
};

import styles from "components/ValueData/ValueData.module.scss";
import { ValueName } from "components/ValueData/ValueName/ValueName";
import { Value } from "components/ValueData/Value/Value";
import { Measurement } from "common";

type Props = {
    measurement: Measurement;
};

export const ValueData = ({ measurement }: Props) => {
    return (
        <div className={styles.valueDataWrapper}>
            <ValueName name={measurement.name} />
            <Value measurement={measurement} />
        </div>
    );
};

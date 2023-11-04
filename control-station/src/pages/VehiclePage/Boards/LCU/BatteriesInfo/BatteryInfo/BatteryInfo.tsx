import styles from "./BatteryInfo.module.scss";
import { BatteryIcon } from "./BatteryIcon/BatteryIcon";
import Title from "./Title/Title";
import { BatteryData } from "./BatteryData";
import { ValueWithUnits } from "components/ValueWithUnits/ValueWithUnits";

type Props = {
    batteryData: BatteryData;
};

export const BatteryInfo = ({ batteryData }: Props) => {
    return (
        <article className={styles.batteryInfoWrapper}>
            {/* TODO: make title dinamic (maybe take index from outer map) */}
            <Title title={"Battery"} />
            <div className={styles.body}>
                <BatteryIcon
                    percentage={50}
                    className={styles.batteryIcon}
                />
                <div className={styles.data}>
                    <ValueWithUnits
                        value={batteryData.voltage.value.average}
                        units={batteryData.voltage.units}
                    />
                    <ValueWithUnits
                        value={batteryData.current.value.average}
                        units={batteryData.current.units}
                    />
                </div>
            </div>
        </article>
    );
};

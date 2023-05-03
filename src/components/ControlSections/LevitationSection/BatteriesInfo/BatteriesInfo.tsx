import styles from "./BatteriesInfo.module.scss";
import { BatteryData } from "./BatteryInfo/BatteryData";
import { BatteryInfo } from "./BatteryInfo/BatteryInfo";

type Props = {
    batteriesData: BatteryData[];
    className?: string;
};

export const BatteriesInfo = ({ batteriesData, className = "" }: Props) => {
    return (
        <div className={`${styles.batteriesInfoWrapper} ${className}`}>
            {batteriesData.map((data, index) => {
                return (
                    <BatteryInfo
                        key={index}
                        batteryData={data}
                    />
                );
            })}
        </div>
    );
};

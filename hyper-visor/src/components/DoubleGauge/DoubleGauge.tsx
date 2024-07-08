import { NumericMeasurementInfo } from "common";
import styles from "./DoubleGauge.module.scss";
import { GaugeTag } from "components/GaugeTag/GaugeTag";

type Props = {
    firstGauge: NumericMeasurementInfo;
    secondGauge: NumericMeasurementInfo;
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

export const DoubleGauge = ({ firstGauge, secondGauge }: Props) => {
    return (
        <div className={styles.doubleGauge}>
            <GaugeTag
                className=""
                min={firstGauge.range[0] ?? DEFAULT_MIN}
                max={firstGauge.range[1] ?? DEFAULT_MAX}
                strokeWidth={150}
                measurement={firstGauge}
            />
            <GaugeTag
                className=""
                min={secondGauge.range[0] ?? DEFAULT_MIN}
                max={secondGauge.range[1] ?? DEFAULT_MAX}
                strokeWidth={150}
                measurement={secondGauge}
            />
        </div>
    );
};

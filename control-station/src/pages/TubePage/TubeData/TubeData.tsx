import { GaugeTag } from "components/GaugeTag/GaugeTag";
import { PumpIndicator } from "./PumpIndicator/PumpIndicator";
import styles from "./TubeData.module.scss";
import { NumericMeasurement } from "common";

const defaultMeasurement: NumericMeasurement = {
    id: "test",
    name: "test",
    safeRange: [0, 100],
    type: "int16",
    units: "A",
    value: { average: 10, last: 12 },
    warningRange: [0, 100],
};

const GAUGE_WIDTH = 130;

export const TubeData = () => {
    return (
        <div className={styles.tubeDataWrapper}>
            <GaugeTag
                className=""
                measurement={defaultMeasurement}
                min={defaultMeasurement.safeRange[0] ?? 0}
                max={defaultMeasurement.safeRange[1] ?? 100}
                strokeWidth={GAUGE_WIDTH}
            ></GaugeTag>
            <PumpIndicator isOn={true} />
            <GaugeTag
                className=""
                measurement={defaultMeasurement}
                min={defaultMeasurement.safeRange[0] ?? 0}
                max={defaultMeasurement.safeRange[1] ?? 100}
                strokeWidth={GAUGE_WIDTH}
            ></GaugeTag>
        </div>
    );
};

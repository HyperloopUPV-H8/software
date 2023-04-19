import { GaugeTag } from "components/GaugeTag/GaugeTag";
import { PumpIndicator } from "./PumpIndicator/PumpIndicator";
import styles from "./TubeData.module.scss";

export const TubeData = () => {
    //TODO: link values to store
    const GAUGE_WIDTH = 130;

    return (
        <div className={styles.tubeDataWrapper}>
            <GaugeTag
                max={100}
                min={0}
                strokeWidth={GAUGE_WIDTH}
                value={20}
            ></GaugeTag>
            <PumpIndicator />
            <GaugeTag
                max={100}
                min={0}
                strokeWidth={GAUGE_WIDTH}
                value={90}
            ></GaugeTag>
        </div>
    );
};

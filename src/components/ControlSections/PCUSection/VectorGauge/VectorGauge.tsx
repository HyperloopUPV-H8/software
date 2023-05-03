import styles from "./VectorGauge.module.scss";
import { GaugeTag } from "components/GaugeTag/GaugeTag";
import { DirectionTag } from "./DirectionTag/DirectionTag";
import { NumericMeasurement } from "common";

type Props = {
    x: NumericMeasurement;
    y: NumericMeasurement;
    z: NumericMeasurement;
};

export const VectorGauge = ({ x, y, z }: Props) => {
    return (
        <article className={styles.vectorGauge}>
            <GaugeTag
                measurement={x}
                min={0}
                max={100}
                value={50}
                strokeWidth={145}
                className={styles.velGauge}
            />
            <div className={styles.directions}>
                <DirectionTag
                    axis="x"
                    value={x.value.average}
                    units={"m"}
                />
                <DirectionTag
                    axis="y"
                    value={y.value.average}
                    units={"m"}
                />
                <DirectionTag
                    axis="z"
                    value={z.value.average}
                    units={"m"}
                />
            </div>
        </article>
    );
};

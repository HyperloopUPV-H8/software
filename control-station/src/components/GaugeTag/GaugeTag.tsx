import styles from 'components/GaugeTag/GaugeTag.module.scss';
import { Gauge } from 'components/GaugeTag/Gauge/Gauge';
import { TextData } from './TextData/TextData';
import { memo, useEffect, useRef, useState } from 'react';
import { useGlobalTicker } from 'common';
import { getPercentageFromRange } from 'state';

type Props = {
    name: string;
    id: string;
    units: string;
    getUpdate: () => number;
    strokeWidth: number;
    min: number;
    max: number;
};
export const GaugeTag = memo(
    ({ name, units, id, getUpdate, strokeWidth, min, max }: Props) => {
        const [value, setValue] = useState(getUpdate());
        const percentage = getPercentageFromRange(value, min, max);

        useGlobalTicker(() => {
            setValue(getUpdate());
        });

        return (
            <article className={styles.gaugeTagWrapper}>
                <Gauge
                    className={styles.gauge}
                    id={id}
                    sweep={250}
                    strokeWidth={strokeWidth}
                    percentage={percentage}
                />
                <TextData name={name} units={units} value={value}></TextData>
            </article>
        );
    }
);

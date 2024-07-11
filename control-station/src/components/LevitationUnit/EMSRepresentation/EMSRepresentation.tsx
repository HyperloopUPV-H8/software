import { NumericMeasurementInfo, useGlobalTicker } from 'common';
import styles from './EMSRepresentation.module.scss';
import { useEffect, useRef, useState } from 'react';
import { getPercentageFromRange } from 'state';
import EMSWall from '../../../assets/svg/EMS-wall.svg';
import EMS from '../../../assets/svg/EMS.svg';

type Props = {
    getUpdate: () => number;
    rangeMin: number;
    rangeMax: number;
    side: 'left' | 'right';
};

export default function EMSRepresentation(props: Props) {
    const [valueState, setValueState] = useState<number>(0);
    const percentage = getPercentageFromRange(
        valueState,
        props.rangeMin,
        props.rangeMax
    );

    useGlobalTicker(() => {
        setValueState(props.getUpdate());
    });

    return (
        <div
            className={`${styles.container} ${
                props.side == 'right' ? styles.rotated : ''
            }`}
        >
            <div className={styles.wall}>
                <img src={EMSWall} alt="wall" />
            </div>

            <div className={styles.unit}>
                <img
                    src={EMS}
                    alt="ems"
                    style={{
                        left: percentage + '%',
                    }}
                />
            </div>
        </div>
    );
}

import styles from './TrackVisualizer.module.scss';
import vehicleTrack from 'assets/svg/vehicle-track.svg';
import vehicle from 'assets/svg/vesper-icon.svg';
import { useGlobalTicker } from 'common';
import { memo, useContext, useState } from 'react';
import { LostConnectionContext } from 'services/connections';
import { getPercentageFromRange } from 'state';

type Props = {
    getUpdate: () => number;
    rangeMin: number;
    rangeMax: number;
};

export const TrackVisualizer = memo((props: Props) => {
    const [valueState, setValueState] = useState<number>(0);
    const lostConnection = useContext(LostConnectionContext);
    const percentage =
        100 -
        (lostConnection
            ? 0
            : getPercentageFromRange(
                  valueState,
                  props.rangeMin,
                  props.rangeMax
              ));

    useGlobalTicker(() => {
        setValueState(props.getUpdate());
    });

    return (
        <div className={styles.container}>
            <div className={styles.track_container}>
                <img src={vehicleTrack} alt="Vehicle Track" />
            </div>
            <div
                className={styles.vehicle_container}
                style={{
                    top: percentage + '%',
                }}
            >
                <img src={vehicle} alt="Vehicle" />
            </div>
        </div>
    );
});

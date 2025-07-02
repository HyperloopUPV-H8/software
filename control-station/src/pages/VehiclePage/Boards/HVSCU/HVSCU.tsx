import { Window } from 'components/Window/Window';
import styles from './HVSCU.module.scss';
import { BarIndicator } from 'components/BarIndicator/BarIndicator';
import { useMeasurementsStore } from 'common';

export const HVSCU = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );

    return (
        <Window title="HVSCU">
            <div className={styles.HVSCU}>
                <div className={styles.levitationUnitsWrapper}>
                    <div className={styles.levitationUnitsColumn}>
                        <div className={styles.text}><h5 className={styles.subtitle}>IMD  status</h5><BarIndicator /></div>
                        <div className={styles.text}><h5 className={styles.subtitle}>HV CHARGER status</h5><BarIndicator /></div>
                        <div className={styles.text}><h5 className={styles.subtitle}>CONTACTORS  status</h5><BarIndicator /></div>
                        <div className={styles.text}><h5 className={styles.subtitle}>LV  status</h5><BarIndicator /></div>
                        <div className={styles.text}><h5 className={styles.subtitle}>SDC  status</h5><BarIndicator /></div>
                    </div>
                </div>
            </div>
        </Window>
    );
};
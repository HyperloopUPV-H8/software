import { Window } from 'components/Window/Window';
import styles from './HVSCU.module.scss';
import { useMeasurementsStore } from 'common';
import { StateIndicator } from 'components/StateIndicator/StateIndicator';

export const HVSCU = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );
// TODO: Get correct measurements from ADJ and correct icons
    return (
        <Window title="HVSCU">
            <div className={styles.HVSCU}>
                <div className={styles.levitationUnitsWrapper}>
                    <div className={styles.levitationUnitsColumn}>  
                        <div className={styles.text}><h5 className={styles.subtitle}>IMD  status</h5><StateIndicator measurementId={'HVSCU-Cabinet/imd_status'} icon={'thunder-filled.svg'} /></div>
                        <div className={styles.text}><h5 className={styles.subtitle}>HV CHARGER status</h5><StateIndicator measurementId={'HVSCU-Cabinet/operational_state_machine_status'} icon={'battery-filled.svg'} /></div>
                        <div className={styles.text}><h5 className={styles.subtitle}>CONTACTORS  status</h5><StateIndicator measurementId={'HVSCU-Cabinet/contactors_status'} icon={'battery-filled.svg'} /></div>
                        <div className={styles.text}><h5 className={styles.subtitle}>LV  status</h5><StateIndicator measurementId={'HVSCU-Cabinet/lv_status'} icon={'battery-filled.svg'} /></div>
                        <div className={styles.text}><h5 className={styles.subtitle}>SDC  status</h5><StateIndicator measurementId={'HVSCU-Cabinet/sdc_status'} icon={'battery-filled.svg'} /></div>
                    </div>
                </div>
            </div>
        </Window>
    );
};
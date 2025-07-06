import { Window } from 'components/Window/Window';
import styles from './HVSCU.module.scss';
import { useMeasurementsStore } from 'common';
import thunderIcon from 'assets/svg/thunder-filled.svg'
import { HvscuStateIndicator, ImdIndicator } from 'components/HvscuStateIndicator/HvscuStateIndicator';

export const HVSCU = () => {
    const getNumericMeasurementInfo = useMeasurementsStore(
        (state) => state.getNumericMeasurementInfo
    );
// TODO: Get correct measurements from ADJ and correct icons
    return (
        <Window title="HVSCU - Status">
            <div className={styles.HVSCU}>
                <div className={styles.levitationUnitsWrapper}>
                    <div className={styles.levitationUnitsColumn}>  
                        <div className={styles.text}><span className={styles.subtitle}>IMD</span><ImdIndicator /></div>
                        <div className={styles.text}><span className={styles.subtitle}>HV CHARGER</span><HvscuStateIndicator measurementId={'HVSCU-Cabinet/operational_state_machine_status'} icon={'battery-filled.svg'} /></div>
                        <div className={styles.text}><span className={styles.subtitle}>CONTACTORS</span><HvscuStateIndicator measurementId={'HVSCU-Cabinet/contactors_status'} icon={'battery-filled.svg'} /></div>
                        <div className={styles.text}><span className={styles.subtitle}>LV CHARGER</span><HvscuStateIndicator measurementId={'HVSCU-Cabinet/lv_status'} icon={'battery-filled.svg'} /></div>
                        <div className={styles.text}><span className={styles.subtitle}>SDC</span><HvscuStateIndicator measurementId={'HVSCU-Cabinet/sdc_status'} icon={'battery-filled.svg'} /></div>
                    </div>
                </div>
            </div>
        </Window>
    );
};
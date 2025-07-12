import { Window } from 'components/Window/Window';
import styles from './HVSCU.module.scss';
import { ImdIndicator } from 'components/ImdIndicator/ImdIndicator';
import { EnumIndicator } from 'components/EnumIndicator/EnumIndicator';
import Battery from 'assets/svg/battery-filled.svg'
import Contactors from 'assets/svg/open-contactors-icon.svg'
import { HvscuCabinetMeasurements, HvscuMeasurements } from 'common';

export const HVSCU = () => {
// TODO: Get correct measurements from ADJ and correct icons
    return (
        <Window title="BMS">
            <div className={styles.HVSCU}>
                <div className={styles.levitationUnitsWrapper}>
                    <div className={styles.levitationUnitsColumn}>  
                        <div className={styles.text}><span className={styles.subtitle}>IMD</span><ImdIndicator /></div>
                        <div className={styles.text}><span className={styles.subtitle}>Vehicle Contactors</span><EnumIndicator measurementId={HvscuMeasurements.Contactors} icon={Contactors} /></div>
                        <div className={styles.text}><span className={styles.subtitle}>Cabinet Contactors</span><EnumIndicator measurementId={HvscuCabinetMeasurements.ContactorsState} icon={Contactors} /></div>
                        <div className={styles.text}><span className={styles.subtitle}>SDC</span><EnumIndicator measurementId={HvscuMeasurements.SdcStatus} icon={Battery} /></div>
                    </div>
                </div>
            </div>
        </Window>
    );
};
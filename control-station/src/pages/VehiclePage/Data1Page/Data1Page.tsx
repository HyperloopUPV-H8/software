import styles from './Data1Page.module.scss';
import { OBCCUBatteries } from '../Boards/OBCCU/OBCCUBatteries';
import { OBCCUGeneralInfo } from '../Boards/OBCCU/OBCCUGeneralInfo';
import { VCUBrakesInfo } from '../Boards/VCU/VCUBrakesInfo';
import { VCUPositionInfo } from '../Boards/VCU/VCUPositionInfo';
import { BCU } from '../Boards/BCU/BCU';
import { BMSL } from '../Boards/BMSL/BMSL';
import { useEmergencyOrders } from 'hooks/useEmergencyOrders';
import Connections from '../Windows/Connections';
import { Connection, useConnections } from 'common';

export const Data1Page = () => {
    useEmergencyOrders();

    return (
        <div className={styles.data1_page}>
            <div className={styles.column}>
                <OBCCUBatteries />
            </div>

            <div className={styles.column}>
                <OBCCUGeneralInfo />
                <BMSL />
            </div>

            <div className={styles.column}>
                <VCUPositionInfo />
            </div>

            <div className={styles.column}>
                <VCUBrakesInfo />
            </div>

            <div className={styles.column}>
                <BCU />
                <Connections />
            </div>
        </div>
    );
};

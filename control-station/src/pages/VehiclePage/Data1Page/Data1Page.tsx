import styles from './Data1Page.module.scss';
import { OBCCUBatteries } from '../Boards/OBCCU/OBCCUBatteries';
import { OBCCUGeneralInfo } from '../Boards/OBCCU/OBCCUGeneralInfo';
import { VCUBrakesInfo } from '../Boards/VCU/VCUBrakesInfo';
import { VCUPositionInfo } from '../Boards/VCU/VCUPositionInfo';
import { BCU } from '../Boards/BCU/BCU';
import { BMSL } from '../Boards/BMSL/BMSL';
import { useEmergencyOrders } from 'hooks/useEmergencyOrders';
import Connections from '../Windows/Connections';
import { Connection, Logger, MessagesContainer, Orders, useConnections } from '../../../../../common-front';
import { PCU } from '../Boards/PCU/PCU';
import { LCU } from '../Boards/LCU/LCU';
import FixedOrders, { getHardcodedOrders } from '../Data2Page/FixedOrders';
import { BrakeVisualizer } from 'components/BrakeVisualizer/BrakeVisualizer';
import { LevitationUnit } from 'components/LevitationUnit/LevitationUnit';

export const Data1Page = () => {
    useEmergencyOrders();

    return (
        <div className={styles.data1_page}>
            <div className={styles.test}> </div>
            <div></div>
            <div></div>
            <div className={`${styles.column} ${styles.lcu}`}>
                <LCU />
            </div>
            <div >
                <MessagesContainer />
            </div>
            <div>
                <Logger />
            </div>
        </div>
    );
};

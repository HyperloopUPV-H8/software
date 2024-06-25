import styles from './BoardsPage.module.scss';
import { OBCCUBatteries } from '../Boards/OBCCU/OBCCUBatteries';
import { OBCCUGeneralInfo } from '../Boards/OBCCU/OBCCUGeneralInfo';
import { VCUBrakesInfo } from '../Boards/VCU/VCUBrakesInfo';
import { VCUPositionInfo } from '../Boards/VCU/VCUPositionInfo';
import { VCUConnectionsInfo } from '../Boards/VCU/VCUConnectionsInfo';

export const BoardsPage1 = () => {
    return (
        <div className={styles.boardsPage}>
            <OBCCUBatteries />
            <div className={styles.column}>
                <OBCCUGeneralInfo />
                <VCUConnectionsInfo />
            </div>
            <VCUPositionInfo />
            <VCUBrakesInfo />
        </div>
    );
};

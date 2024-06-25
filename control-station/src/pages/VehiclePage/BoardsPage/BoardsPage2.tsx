import styles from './BoardsPage.module.scss';
import { LCU } from '../Boards/LCU/LCU';
import { Messages } from '../Messages/Messages';
import { PCU } from '../Boards/PCU/PCU';

export const BoardsPage2 = () => {
    return (
        <div className={styles.boardsPage}>
            <LCU />

            <div className={styles.column}>
                <PCU />
                {/* <Controls /> */}
            </div>

            <div className={styles.column}>{/* <Controls /> */}</div>
        </div>
    );
};

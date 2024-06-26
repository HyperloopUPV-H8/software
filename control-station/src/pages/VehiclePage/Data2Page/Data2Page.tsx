import styles from './BoardsPage.module.scss';
import { LCU } from '../Boards/LCU/LCU';
import { PCU } from '../Boards/PCU/PCU';

export const Data2Page = () => {
    return (
        <div className={styles.boardsPage}>
            <LCU />

            <div className={styles.column}>
                <PCU />
            </div>
        </div>
    );
};

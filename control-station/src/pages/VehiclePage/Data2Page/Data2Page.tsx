import styles from './Data2Page.module.scss';
import { LCU } from '../Boards/LCU/LCU';
import { PCU } from '../Boards/PCU/PCU';

export const Data2Page = () => {
    return (
        <div className={styles.data2_page}>
            <div className={styles.column}>
                <LCU />
            </div>

            <div className={styles.column}>
                <PCU />
            </div>
        </div>
    );
};

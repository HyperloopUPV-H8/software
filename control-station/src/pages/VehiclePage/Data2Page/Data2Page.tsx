import styles from './Data2Page.module.scss';
import { LCU } from '../Boards/LCU/LCU';
import { PCU } from '../Boards/PCU/PCU';
import { Orders, useOrders } from 'common';
import { Connections, Logger, MessagesContainer } from 'common';
import { Window } from 'components/Window/Window';
import FixedOrders, { getHardcodedOrders } from './FixedOrders';

export const Data2Page = () => {
    const boardOrders = useOrders();

    return (
        <div className={styles.data2_page}>
            <div className={`${styles.column} ${styles.lcu}`}>
                <LCU />
            </div>

            <div className={styles.column}>
                <PCU />
            </div>

            <div className={styles.column}>
                <Window title="Orders" className={styles.orders}>
                    <div className={styles.order_column}>
                        <Orders boards={getHardcodedOrders(boardOrders)} />
                        <FixedOrders />
                    </div>
                </Window>
            </div>

            <div className={styles.column}>
                <Window title="Messages" className={styles.messages}>
                    <MessagesContainer />
                </Window>

                <Window title="Connections">
                    <Connections />
                </Window>

                <Window title="Logger">
                    <Logger />
                </Window>
            </div>
        </div>
    );
};

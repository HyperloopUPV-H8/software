import styles from './BatteriesPage.module.scss';
import { LCU } from '../Boards/LCU/LCU';
import { Orders, useOrders } from 'common';
import { Connections, Logger, MessagesContainer } from 'common';
import { Window } from 'components/Window/Window';
import FixedOrders, { getHardcodedOrders } from './FixedOrders';
import { usePodDataUpdate } from 'hooks/usePodDataUpdate';
import { Connection, useConnections } from 'common';
import { LostConnectionContext } from 'services/connections';

export const BatteriesPage = () => {
    usePodDataUpdate();
    
    const connections = useConnections();
    const boardOrders = useOrders();

    return (
        <LostConnectionContext.Provider
             value={any(
                [...connections.boards, connections.backend],
                 isDisconnected
             )}
        >
        <div className={styles.data2_page}>
            <div className={`${styles.column} ${styles.lcu}`}>
                <LCU />
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

            <div className={styles.column}>
                <Window title="Orders" className={styles.orders}>
                    <div className={styles.order_column}>
                        <Orders boards={getHardcodedOrders(boardOrders)} />
                        <FixedOrders />
                    </div>
                </Window>
            </div>
        </div>
        
        </LostConnectionContext.Provider>
    );
};

function isDisconnected(connection: Connection): boolean {
    return !connection.isConnected;
}

function all<T>(data: T[], condition: (value: T) => boolean): boolean {
    for (const value of data) {
        if (!condition(value)) {
            return false;
        }
    }
    return true;
}

function any<T>(data: T[], condition: (value: T) => boolean): boolean {
    for (const value of data) {
        if (condition(value)) {
            return true;
        }
    }
    return false;
}

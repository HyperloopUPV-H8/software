import { Orders, useOrders } from 'common';
import styles from './ControlPage.module.scss';
import { Connections, Logger, MessagesContainer } from 'common';
import { Window } from 'components/Window/Window';
import { getHardcodedOrders } from './hardcodedOrders';

export const ControlPage = () => {
    const boardOrders = useOrders();

    return (
        <div className={styles.controlPage}>
            <Window title="Orders" height="fill">
                <Orders orders={getHardcodedOrders(boardOrders)} />
            </Window>
            <div className={styles.column}>
                <Window title="Messages" height="fill">
                    <MessagesContainer />
                </Window>
            </div>
            <Window title="Connections" height="fill">
                <Connections />
            </Window>
            <Window title="Logger">
                <Logger />
            </Window>
        </div>
    );
};

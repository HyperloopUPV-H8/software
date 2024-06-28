import { Orders, useOrders } from 'common';
import styles from './ControlPage.module.scss';
import { Connections, Logger, MessagesContainer } from 'common';
import { Window } from 'components/Window/Window';
import { getHardcodedOrders } from './hardcodedOrders';

export const ControlPage = () => {
    const boardOrders = useOrders();

    return (
        <div className={styles.control_page}>
            <div className={styles.column}>
                <Window title="Orders">
                    <Orders orders={getHardcodedOrders(boardOrders)} />
                </Window>
            </div>
            <div className={styles.column}>
                <Window title="Messages">
                    <MessagesContainer />
                </Window>
            </div>
            <div className={styles.column}>
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

import styles from './Data1Page.module.scss';
import { LCU } from '../Boards/LCU/LCU';
import { HVSCU } from '../Boards/HVSCU/HVSCU';
import { Orders, useOrders } from 'common';
import { MessagesContainer } from 'common';
import { Window } from 'components/Window/Window';
import { emergencyStopOrders, getHardcodedOrders } from '../Data2Page/FixedOrders';
import { BigOrderButton } from 'components/BigOrderButton';
import { ChartDLIM, ChartLSM } from './Data1Modules/Data1Charts';
import { Batteries } from './Data1Modules/Data1Batteries';
import { LEDS } from './Data1Modules/Leds';
import { BrakeState } from './Data1Modules/BrakeState';
import { PodPosition } from './Data1Modules/PodPosition';

export const Data1Page = () => {
    const boardOrders = useOrders();

    return (
        <div className={styles.data1_page}>
            <LEDS/>
            <PodPosition/>
            <div className={styles.main}>
                <div className={styles.column}>
                    <ChartDLIM/>
                    <Window title="Orders" className={styles.orders}>
                        <div className={styles.order_column}>
                            <Orders boards={getHardcodedOrders(boardOrders)} />
                        </div>
                    </Window>
                </div>

                <div className={styles.column_center}>
                <BrakeState/>
                    <div className={styles.row}>
                        <HVSCU />
                        <LCU />
                    </div>

                    <Batteries/>

                    <div className={styles.emergency_wrapper}>
                        <BigOrderButton
                            orders={emergencyStopOrders}
                            label="⚠️ EMERGENCY STOP"
                            shortcut=" "
                            className={`${styles.emergency_button} ${styles.emergency_stop}`}
                            brightness={3}
                        />
                    </div>
                </div>

                <div className={styles.column}>
                    <ChartLSM/>
                    <Window title="Messages" className={styles.messages}>
                        <MessagesContainer />
                    </Window>
                </div>
            </div>
        </div>
    );
};
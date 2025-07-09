import styles from './MainPage.module.scss';
import { HVSCU } from '../Boards/HVSCU/HVSCU';
import { MessagesContainer } from 'common';
import { Window } from 'components/Window/Window';
import { emergencyStopOrders, getHardcodedOrders } from '../BatteriesPage/FixedOrders';
import { BigOrderButton } from 'components/BigOrderButton';
import { ChartDLIM, ChartLSM } from './MainPageModules/MainCharts';
import { Batteries } from './MainPageModules/MainBatteries';
import { LEDS } from './MainPageModules/Leds';
import { BrakeState } from './MainPageModules/BrakeState';
import { PodPosition } from './MainPageModules/PodPosition';
import { OrdersContainer } from 'components/OrdersContainer/OrdersContainer';
import { usePodDataUpdate } from 'hooks/usePodDataUpdate';
import { Connection, useConnections } from 'common';
import { LostConnectionContext } from 'services/connections';
import { LCUandMaster } from './MainPageModules/LCUandMaster';

export const MainPage = () => {
    usePodDataUpdate();
    
    const connections = useConnections();

    return (
        <LostConnectionContext.Provider
             value={any(
                [...connections.boards, connections.backend],
                 isDisconnected
             )}
        >
        <div className={styles.data1_page}>
            <LEDS/>
            <PodPosition/>
            <div className={styles.main}>
                <div className={styles.column}>
                    <ChartDLIM/>
                    <Window title="Orders" className={styles.orders}>
                        <div className={styles.order_column}>
                            <OrdersContainer boardOrdersFilter={getHardcodedOrders}/>
                        </div>
                    </Window>
                </div>

                <div className={styles.column_center}>
                <BrakeState/>
                    <div className={styles.row}>
                        <HVSCU />
                        <LCUandMaster />
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
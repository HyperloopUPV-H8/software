import styles from './Data1Page.module.scss';
import { LCU } from '../Boards/LCU/LCU';
import { HVSCU } from '../Boards/HVSCU/HVSCU';
import { BcuMeasurements, ColorfulChart, Orders, PcuMeasurements, useMeasurementsStore, useOrders } from 'common';
import { MessagesContainer } from 'common';
import { Window } from 'components/Window/Window';
import { Window2 } from 'components/Window/Window2';
import FixedOrders, { emergencyStopOrders, getHardcodedOrders } from '../Data2Page/FixedOrders';
import { Gauge } from 'components/GaugeTag/Gauge/Gauge';
import { BatteryIndicator } from 'components/BatteryIndicator/BatteryIndicator';
import { BigOrderButton } from 'components/BigOrderButton';
import { ChartDLIM, ChartLSM } from './Data1Charts/Data1Charts';

export const Data1Page = () => {
    const boardOrders = useOrders();

    return (
        <div className={styles.data1_page}>
            <div className={styles.leds}>
                <h1>LEDS</h1>
            </div>

            <div className={styles.main}>
                <div className={styles.column}>
                    <ChartDLIM/>
                    <Window title="Orders" className={styles.orders}>
                        <div className={styles.order_column}>
                            <Orders boards={getHardcodedOrders(boardOrders)} />
                            <FixedOrders />
                        </div>
                    </Window>
                </div>

                <div className={styles.column_center}>
                    <div className={styles.break_state}>
                    <h1>BRAKE STATE</h1>
                </div>
                <div className={styles.pod}>
                    <h1>POD</h1>
                </div>
                    <div className={styles.row}>
                        <HVSCU />
                        <LCU />
                    </div>

                    <div className={styles.row}>
                        <Window2 title="High Voltage" className={styles.voltage}>
                            <Gauge id="hv" sweep={180} strokeWidth={15} percentage={75} className="" />
                            <BatteryIndicator />
                        </Window2>

                        <Window2 title="Low Voltage" className={styles.voltage}>
                            <Gauge id="lv" sweep={180} strokeWidth={15} percentage={45} className="" />
                            <BatteryIndicator />
                        </Window2>

                        <Window2 title="BOOSTER" className={styles.voltage}>
                            <Gauge id="boost" sweep={180} strokeWidth={15} percentage={55} className="" />
                            <BatteryIndicator />
                        </Window2>
                    </div>

                    <div className={styles.emergency_wrapper}>
                        <BigOrderButton
                            orders={emergencyStopOrders}
                            label="Emergency Stop"
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
import { BoardOrders, Order, OrderDescription } from 'common';
import { BigOrderButton } from 'components/BigOrderButton';
import { ReactComponent as BrakeIcon } from '../../../assets/svg/brake-icon.svg';
import { ReactComponent as OpenContactorsIcon } from '../../../assets/svg/open-contactors-icon.svg';
import { ReactComponent as EmergencyStopIcon } from '../../../assets/svg/emergency-stop-icon.svg';
import styles from './FixedOrders.module.scss';

export type Props = {};

export default function FixedOrders(_: Props) {
    return (
        <div className={styles.fixed_orders}>
            <BigOrderButton
                orders={openContactorsOrders}
                label="Open Contactors"
                shortcut="o"
                icon={<OpenContactorsIcon />}
                className={`${styles.emergency_button} ${styles.open_contactors}`}
                brightness={1.3}
            />
            <BigOrderButton
                orders={brakeOrders}
                label="Brake / Stop"
                shortcut="b"
                icon={<BrakeIcon />}
                className={`${styles.emergency_button} ${styles.brake_stop}`}
                brightness={1.8}
            />
            <BigOrderButton
                orders={emergencyStopOrders}
                label="Emergency Stop"
                shortcut=" "
                icon={<EmergencyStopIcon />}
                className={`${styles.emergency_button} ${styles.emergency_stop}`}
                brightness={3}
            />
        </div>
    );
}

const brakeOrders: Order[] = [
    {
        id: 215,
        fields: {},
    },
];

const openContactorsOrders: Order[] = [
    {
        id: 902,
        fields: {},
    },
];

const emergencyStopOrders: Order[] = [
    ...brakeOrders,
    ...openContactorsOrders,
    {
        id: 0,
        fields: {},
    },
];

export const hardcodedOrderIds = {
    set_regulator_pressure: 210,
    brake: 215,
    unbrake: 216,
    disable_emergency_tape: 217,
    enable_emergency_tape: 218,
    start_vertical_levitation: 356,
    stop_levitation: 357,
    start_horizontal_levitation: 360,
    test_current_control: 607,
    stop_pcu_control: 609,
    test_speed_control: 619,
    test_svpwm: 615,
    open_contactors: 902,
    close_contactors: 903,
};

export function getHardcodedOrders(boardOrders: BoardOrders[]): BoardOrders[] {
    const foundOrders = [] as OrderDescription[];
    const wantedOrdersIds = Object.values(hardcodedOrderIds);
    for (const board of boardOrders) {
        for (const order of board.orders) {
            if (wantedOrdersIds.includes(order.id)) {
                foundOrders.push(order);
            }
        }
        for (const stateOrder of board.stateOrders) {
            if (wantedOrdersIds.includes(stateOrder.id)) {
                foundOrders.push(stateOrder);
            }
        }
    }

    return [{ name: 'General Orders', orders: foundOrders, stateOrders: [] }];
}

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

export const brakeOrders: Order[] = [
    {
        id: 215,
        fields: {},
    },
];

export const openContactorsOrders: Order[] = [
    {
        id: 902,
        fields: {},
    },
];

export const emergencyStopOrders: Order[] = [
    ...brakeOrders,
    ...openContactorsOrders,
    {
        id: 0,
        fields: {},
    },
];

export const desiredOrders = [
    0, 902, 903, 216, 210, 355, 356, 357, 360, 609, 619, 614, 293, 294,
];

export function getHardcodedOrders(boardOrders: BoardOrders[]): BoardOrders[] {
    for (const board of boardOrders) {
        board.orders = board.orders.filter((order) =>
            desiredOrders.includes(order.id)
        );
        board.stateOrders = board.stateOrders.filter((order) =>
            desiredOrders.includes(order.id)
        );
    }

    return boardOrders;
}

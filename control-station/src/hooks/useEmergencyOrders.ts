import { Order, useListenKey, useSendOrder } from 'common';
import {
    BrakeOrder,
    OpenContactorsOrder,
} from 'pages/VehiclePage/ControlPage/hardcodedOrders';

export function useEmergencyOrders(
    shortcut: string = ' ',
    orders: Order[] = [BrakeOrder, OpenContactorsOrder]
) {
    const sendOrder = useSendOrder();
    useListenKey(
        shortcut,
        () => {
            for (const order of orders) {
                sendOrder(order);
            }
        },
        true
    );
}

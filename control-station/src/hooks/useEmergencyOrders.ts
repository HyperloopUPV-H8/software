import { Order, useListenKey, useSendOrder } from 'common';
import { emergencyStopOrders } from 'pages/VehiclePage/BatteriesPage/FixedOrders';

export function useEmergencyOrders(
    shortcut: string = ' ',
    orders: Order[] = emergencyStopOrders
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

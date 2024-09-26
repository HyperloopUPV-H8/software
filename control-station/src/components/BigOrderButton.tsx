import { Order, useListenKey, useSendOrder } from 'common';
import styles from './BigOrderButton.module.scss';
import { ReactNode } from 'react';
import { animated, useSpring } from '@react-spring/web';

type Props = {
    orders: Order | Order[];
    label: ReactNode;
    icon?: ReactNode;
    shortcut?: string;
    className?: string;
    brightness?: number;
};

export function BigOrderButton({
    orders,
    label,
    icon,
    shortcut,
    className,
    brightness = 1.2,
}: Props) {
    const [springs, api] = useSpring(() => ({
        from: { filter: 'brightness(1)' },
        config: {
            tension: 600,
        },
    }));

    const sendOrder = useSendOrder();

    const trySendOrder = Array.isArray(orders)
        ? () => {
              api.start({
                  from: { filter: `brightness(${brightness})` },
                  to: { filter: 'brightness(1)' },
              });
              for (const order of orders) {
                  sendOrder(order);
              }
          }
        : () => {
              api.start({
                  from: { filter: `brightness(${brightness})` },
                  to: { filter: 'brightness(1)' },
              });
              sendOrder(orders);
          };

    if (shortcut != undefined) {
        useListenKey(shortcut, trySendOrder, true);
    }

    return (
        <animated.button
            onClick={trySendOrder}
            className={`${styles.big_order_button} ${className}`}
            style={{ ...springs }}
        >
            {icon}
            {label}
        </animated.button>
    );
}

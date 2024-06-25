import { Window } from 'components/Window/Window';
import { ControlButton } from './ControlButton';
import styles from './Controls.module.scss';
import { useSendOrder } from 'common';
import {
    BrakeOrder,
    OpenContactorsOrder,
} from 'pages/VehiclePage/ControlPage/hardcodedOrders';

type Props = {};

export const Controls = (_: Props) => {
    const sendOrder = useSendOrder();

    return (
        <Window title="Controls">
            <div className={styles.container}>
                <ControlButton
                    text="Brake"
                    shortcut={['b', ' ']}
                    onClick={() => sendOrder(BrakeOrder)}
                />
                <ControlButton
                    text="Open Contactors"
                    shortcut={['o', ' ']}
                    onClick={() => sendOrder(OpenContactorsOrder)}
                />
                <ControlButton
                    text="Start Vertical Levitation"
                    onClick={() => sendOrder(StartVerticalLevitationOrder)}
                />
                <ControlButton
                    text="Start Horizontal Levitation"
                    onClick={() => sendOrder(StartHorizontalLevitationOrder)}
                />
                <ControlButton
                    text="Unbrake"
                    onClick={() => sendOrder(UnbrakeOrder)}
                />
                <ControlButton text="Close Contactors" />
                <ControlButton text="Test SVPWM" />
                <ControlButton text="Test Current Control" />
            </div>
        </Window>
    );
};

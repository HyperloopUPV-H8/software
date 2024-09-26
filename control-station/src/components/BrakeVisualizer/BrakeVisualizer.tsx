import styles from './BrakeVisualizer.module.scss';
import brakeContracted from 'assets/svg/brake-contracted.svg';
import brakeExtended from 'assets/svg/brake-extended.svg';
import { useGlobalTicker } from 'common';
import { useContext, useState } from 'react';
import { LostConnectionContext } from 'services/connections';

interface Props {
    getStatus: () => string;
    rotation: 'left' | 'right';
}

export const BrakeVisualizer = ({ getStatus, rotation }: Props) => {
    const [status, setStatus] = useState(getStatus());
    const lostConnection = useContext(LostConnectionContext);

    useGlobalTicker(() => {
        setStatus(getStatus());
    });

    return (
        <div
            className={styles.brakeVisualizerWrapper}
            style={{
                transform: rotation === 'left' ? 'scaleX(1)' : 'scaleX(-1)',
            }}
        >
            <img
                src={
                    status == 'EXTENDED' || lostConnection
                        ? brakeExtended
                        : brakeContracted
                }
                alt={
                    status == 'EXTENDED' || lostConnection
                        ? 'Brake Extended'
                        : 'Brake Contracted'
                }
            />
        </div>
    );
};

import { useListenKey } from 'common';
import styles from './ControlButton.module.scss';

type Props = {
    text: string;
    onClick: () => void;
    shortcut?: string | string[];
    className?: string;
};

export const ControlButton = (props: Props) => {
    if (props.shortcut != undefined) {
        if (typeof props.shortcut == 'string') {
            useListenKey(props.shortcut, props.onClick, true);
        } else {
            for (const short of props.shortcut) {
                useListenKey(short, props.onClick, true);
            }
        }
    }

    return (
        <button
            className={`${styles.button} ${props.className}`}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

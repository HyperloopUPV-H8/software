import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import style from "./PlayButton.module.scss";

type ButtonType = keyof typeof buttonVariants;

// type Variant = {
//     icon: ReactNode;
//     colorClass: string;
// };

export type PlayButtons = {
    play: boolean;
    stop: boolean;
};

const buttonVariants = {
    play: {
        icon: <FaPlay />,
        colorClass: style.green,
    },
    pause: {
        icon: <FaPause />,
        colorClass: style.yellow,
    },
    stop: {
        icon: <FaStop />,
        colorClass: style.red,
    },
    disabled: {
        icon: <FaStop />,
        colorClass: style.gray,
    },
} as const;

// const START_IDLE = "Back-end is ready!";
// const START_SIMULATION = "start_simulation";
// const FINISH_SIMULTATION = "finish_simulation";

type Props = {
    variant: ButtonType;
    state: boolean;
    onClick: () => void;
} & Omit<
    DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >,
    "onClick"
>;

export function PlayButton({
    className,
    variant,
    state,
    onClick,
    ...buttonProps
}: Props) {
    const { icon, colorClass } = buttonVariants[variant];
    const classes = `${colorClass} ${className} ${style.playButton}`;

    return (
        <button
            className={`${style.playButton} ${
                state ? classes : style.disabled
            }`}
            disabled={!state || variant === "disabled"}
            onClick={onClick}
            {...buttonProps}
        >
            {icon}
        </button>
    );
}

// function handleClick(
//     variant: ButtonType,
//     state: boolean,
//     sendMessage: SendMessage | undefined,
//     changeState: (playButtons: PlayButtons) => void
// ) {
//     switch (variant) {
//         case "play":
//             sendMsgSimultation(sendMessage!, START_SIMULATION);
//             changeState({ play: !state, stop: state });
//             break;
//         case "stop":
//             sendMsgSimultation(sendMessage!, FINISH_SIMULTATION);
//             changeState({ play: state, stop: !state });
//             break;
//     }
// }

// function sendMsgSimultation(sendMessage: SendMessage, msg: string) {
//     const message: WebSocketMessage = msg;
//     sendMessage(message);
// }

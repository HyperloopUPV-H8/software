import { ButtonHTMLAttributes, DetailedHTMLProps, useEffect } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import style from "./PlayButton.module.scss";
import { SendMessage } from "react-use-websocket";
import { WebSocketMessage } from "react-use-websocket/dist/lib/types";

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

const START_IDLE = "Back-end is ready!";
const START_SIMULATION = "start_simulation";
const FINISH_SIMULTATION = "finish_simulation";

type Props = {
    variant: ButtonType;
    state: boolean;
    changeState: (playButtons: PlayButtons) => void;
    sendMessage?: SendMessage;
    lastMessage?: MessageEvent<any> | null;
} & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export function PlayButton({
    variant,
    state,
    changeState,
    sendMessage,
    lastMessage,
    className,
    ...buttonProps
}: Props) {
    const { icon, colorClass } = buttonVariants[variant];

    const name = `${colorClass} ${className} ${style.playButton}`;

    useEffect(() => {
        const stringData: string = lastMessage?.data;
        if (stringData == START_IDLE) {
            changeState({ play: true, stop: false });
        }
    }, [lastMessage]);

    return (
        <button
            className={`${style.playButton} ${!state ? style.disabled : name}`}
            disabled={!state || variant === "disabled"}
            onClick={() => {
                handleClick(variant, state, sendMessage, changeState);
            }}
            {...buttonProps}
        >
            {icon}
        </button>
    );
}

function handleClick(
    variant: ButtonType,
    state: boolean,
    sendMessage: SendMessage | undefined,
    changeState: (playButtons: PlayButtons) => void
) {
    switch (variant) {
        case "play":
            sendMsgSimultation(sendMessage!, START_SIMULATION);
            changeState({ play: !state, stop: state });
            break;
        case "stop":
            sendMsgSimultation(sendMessage!, FINISH_SIMULTATION);
            changeState({ play: state, stop: !state });
            break;
    }
}

function sendMsgSimultation(sendMessage: SendMessage, msg: string) {
    const message: WebSocketMessage = msg;
    sendMessage(message);
}

import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { FaPlay, FaPause, FaStop, FaLessThanEqual } from "react-icons/fa";
import style from "./PlayButton.module.scss";
import { SendMessage } from "react-use-websocket";
import { WebSocketMessage } from "react-use-websocket/dist/lib/types";
import { PlayButtons } from "pages/TestingPage/TestControls/TestControls";

type ButtonType = keyof typeof buttonVariants;

type Variant = {
    icon: ReactNode;
    colorClass: string;
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
            console.log("Poner play a true");
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
            console.log("play clicked");
            sendMsgSimultation(sendMessage!, "start_simulation");
            changeState({ play: !state, stop: state });
            break;
        case "stop":
            console.log("stop clicked");
            sendMsgSimultation(sendMessage!, "finish_simulation");
            changeState({ play: state, stop: !state });
            break;
    }
}

function sendMsgSimultation(sendMessage: SendMessage, msg: string) {
    console.log(msg);
    const message: WebSocketMessage = msg;
    sendMessage(message);
}

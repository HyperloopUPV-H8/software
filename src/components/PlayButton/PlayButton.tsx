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
    sendMessage?: SendMessage;
    lastMessage?: MessageEvent<any> | null;
} & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export function PlayButton({
    variant,
    sendMessage,
    lastMessage,
    className,
    ...buttonProps
}: Props) {
    const { icon, colorClass } = buttonVariants[variant];

    const name = `${colorClass} ${className} ${style.playButton}`;
    const [disabledState, setDisabledState] = useState(true);

    useEffect(() => {
        const stringData: string = lastMessage?.data;
        if (stringData == START_IDLE) {
            setDisabledState(false);
        }
    }, [lastMessage]);

    return (
        <button
            className={`${style.playButton} ${
                disabledState ? style.disabled : name
            }`}
            disabled={disabledState || variant === "disabled"}
            onClick={() => {
                handleClick(variant, sendMessage);
            }}
            {...buttonProps}
        >
            {icon}
        </button>
    );
}

function handleClick(
    variant: ButtonType,
    sendMessage: SendMessage | undefined
) {
    switch (variant) {
        case "play":
            initSimultation(sendMessage!); //TODO: Habilitate stop button
            break;
        case "stop":
            finishSimulation();
            break;
    }
}

function initSimultation(sendMessage: SendMessage) {
    console.log("State simultaion");
    const message: WebSocketMessage = "start_simulation";
    sendMessage(message);
}

function finishSimulation() {
    console.log("finish state simultaion");
}

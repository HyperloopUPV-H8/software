import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    HTMLInputTypeAttribute,
    ReactNode,
} from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import style from "./PlayButton.module.scss";

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

type Props = {
    variant: ButtonType;
} & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export function PlayButton({
    variant,
    className,
    disabled,
    ...buttonProps
}: Props) {
    const { icon, colorClass } = buttonVariants[variant];

    const name = `${colorClass} ${className} ${style.playButton}`;
    return (
        <button
            className={name}
            disabled={disabled || variant === "disabled"}
            {...buttonProps}
        >
            {icon}
        </button>
    );
}

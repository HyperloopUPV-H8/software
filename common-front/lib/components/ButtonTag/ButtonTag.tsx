import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import style from "./ButtonTag.module.scss";

type Props = {
    label?: string;
    icon: ReactNode;
    onClick: () => void;
} & Omit<
    DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >,
    "onClick"
>;

export function ButtonTag({
    icon,
    label,
    onClick,
    disabled,
    ...buttonProps
}: Props) {
    return (
        <label
            className={`${style.buttonTagWrapper} ${
                disabled ? style.disabled : style.enabled
            }`}
        >
            <button
                {...buttonProps}
                onClick={() => {
                    if (!disabled) {
                        onClick();
                    }
                }}
            >
                {icon}
            </button>
            {label && <p>{label}</p>}
        </label>
    );
}

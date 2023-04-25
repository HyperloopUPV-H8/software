import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import style from "./ButtonTag.module.scss";

type Props = {
    label?: string;
    icon: ReactNode;
    onClick: () => void;
} & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
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
            className={
                disabled
                    ? style.buttonTagWrapperDisabled
                    : style.buttonTagWrapper
            }
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

import { useToggle } from "hooks/useToggle";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode, useEffect, MouseEvent } from "react";
import style from "./ToggleButton.module.scss"

type Props = {
    label: string;
    icon: ReactNode;
    onToggle?: (state: boolean) => void;
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export function ToggleButton({ label, icon, onToggle, onClick, ...buttonProps }: Props) {
    const [isOn, flip] = useToggle()

    if (onToggle) {
        useEffect(() => {
            onToggle(isOn)
        }, [isOn])
    }

    let onClickFlip = (_: any) => {
        flip()
    }
    if (onClick) {
        onClickFlip = (ev: MouseEvent<HTMLButtonElement>) => {
            flip()
            onClick(ev)
        }
    }

    const name = `${style.toggleButtonWrapper} ${isOn ? style.on : style.off}`
    return (
        <label className={name}>
            <button onClick={onClickFlip} {...buttonProps}>
                {icon}
            </button>
            <p>{label}</p>
        </label>
    )
}
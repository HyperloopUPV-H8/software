import { useToggle } from "hooks/useToggle";
import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    ReactNode,
    useEffect,
} from "react";
import style from "./ToggleButton.module.scss";

type Props = {
    label: string;
    icon: ReactNode;
    onToggle?: (state: boolean) => void;
} & Omit<
    DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >,
    "onClick"
>;

export function ToggleButton({ label, icon, onToggle, ...buttonProps }: Props) {
    const [isOn, flip] = useToggle();

    useEffect(() => {
        onToggle?.(isOn);
    }, [isOn]);

    const name = `${style.toggleButtonWrapper} ${isOn ? style.on : style.off}`;
    return (
        <label className={name}>
            <button onClick={flip} {...buttonProps}>
                {icon}
            </button>
            <p>{label}</p>
        </label>
    );
}

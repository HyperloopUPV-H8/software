import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import style from "./ButtonTag.module.scss";

type Props = {
    label?: string;
    icon: ReactNode;
} & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export function ButtonTag({ icon, label, ...buttonProps }: Props) {
    return (
        <label className={style.buttonTagWrapper}>
            <button {...buttonProps}>{icon}</button>
            {label && <p>{label}</p>}
        </label>
    );
}

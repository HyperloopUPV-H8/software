import { useToggle } from "hooks/useToggle";
import { useEffect, useState } from "react";
import style from "./ToggleButton.module.scss"

type Props = {
    label: string;
    icon: React.ReactNode;
    onToggle: (state: boolean) => void;
}

export function ToggleButton(props: Props) {
    const [isOn, flip] = useToggle()

    useEffect(() => {
        props.onToggle(isOn)
    }, [isOn])

    return (
        <label className={isOn ? style.toggleButtonWrapperOn : style.toggleButtonWrapperOff}>
            <button onClick={flip}>
                {props.icon}
            </button>
            <p>{props.label}</p>
        </label>
    )
}
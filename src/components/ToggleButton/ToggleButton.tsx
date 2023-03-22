import { useState } from "react";
import style from "./ToggleButton.module.scss"

type Props = {
    label: string;
    id?: string;
    icon: React.ReactNode;
    onToggle: (target: string, state: boolean) => void;
}

export function ToggleButton(props: Props) {
    const [isToggeled, setIsToggeled] = useState(false)

    const target = props.id ?? props.label
    function onClick() {
        setIsToggeled((prev) => {
            const next = !prev
            props.onToggle(target, next)
            return next
        })
    }

    return (
        <div className={isToggeled ? style.toggleButtonWrapperOn : style.toggleButtonWrapperOff}>
            <button onClick={onClick}>
                {props.icon}
            </button>
            <p>{props.label}</p>
        </div>
    )
}
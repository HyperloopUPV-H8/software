import { useToggle } from "hooks/useToggle";
import { useEffect } from "react";
import style from "./ToggleSwitch.module.scss";

type Props = {
    isOn: boolean,
    flip: () => void,
}

export function ToggleSwitch({ isOn, flip }: Props) {
    return (
        <label className={isOn ? style.toggleSwitchWrapperOn : style.toggleSwitchWrapperOff} onClick={flip}>
            <div></div>
        </label>
    )
}
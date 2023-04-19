import { useToggle } from "hooks/useToggle";
import { useEffect } from "react";
import style from "./ToggleSwitch.module.scss";

type Props = {
    onToggle: (isOn: boolean) => void,
}

export function ToggleSwitch({ onToggle }: Props) {
    const [isOn, flip] = useToggle();

    useEffect(() => {
        onToggle(isOn);
    }, [isOn])

    return (
        <label className={isOn ? style.toggleSwitchWrapperOn : style.toggleSwitchWrapperOff} onClick={flip}>
            <div></div>
        </label>
    )
}
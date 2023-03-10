import { useToggle } from "hooks/useToggle";
import { useEffect } from "react";
import style from "./ToggleSwitch.module.scss";

type Props = {
    onToggle: (state: boolean) => void;
}

export function ToggleSwitch(props: Props) {
    const [isOn, flip] = useToggle()

    useEffect(() => {
        props.onToggle(isOn)
    }, [isOn])

    return (
        <label className={isOn ? style.toggleSwitchWrapperOn : style.toggleSwitchWrapperOff} onClick={flip}>
            <div></div>
        </label>
    )
}
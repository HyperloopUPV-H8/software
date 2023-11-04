import { useEffect } from "react";
import style from "./ToggleSwitch.module.scss";

type Props = {
    onToggle: (isOn: boolean) => void;
    isOn: boolean;
    flip: () => void;
};

export function ToggleSwitch({ onToggle, isOn, flip }: Props) {
    useEffect(() => {
        onToggle(isOn);
    }, [isOn]);

    return (
        <label
            className={`${style.toggleSwitchWrapper} ${
                isOn ? style.on : style.off
            }`}
            onClick={flip}
        >
            <div></div>
        </label>
    );
}

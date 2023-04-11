import { InputTag } from "components/InputTag/InputTag";
import { ToggleSwitch } from "components/ToggleSwitch/ToggleSwitch";
import { useToggle } from "hooks/useToggle";
import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from "react";
import style from "./ToggleInput.module.scss";

type Props = {
    label: string,
    onToggle?: (state: boolean) => void,
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export function ToggleInput({ onToggle, disabled, ...inputProps }: Props) {
    const [isOn, setIsOn] = useState(false);

    const onSwitchToggle = (isSwitchOn: boolean) => {
        setIsOn(isSwitchOn);
        onToggle?.(isSwitchOn);
    }


    return (
        <div className={style.toggleInputWrapper}>
            <InputTag isOn={isOn} disabled={!isOn || disabled} {...inputProps} />
            <ToggleSwitch onToggle={onSwitchToggle} />
        </div>
    )
}
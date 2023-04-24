import { InputTag } from "components/InputTag/InputTag";
import { ToggleSwitch } from "components/ToggleSwitch/ToggleSwitch";
import { useToggle } from "hooks/useToggle";
import { DetailedHTMLProps, InputHTMLAttributes, useEffect } from "react";
import style from "./ToggleInput.module.scss";
import { InputValue } from "pages/TestingPage/TestControls/TestAttributes";

type Props = {
    id: string;
    onChange: (state: number) => void;
    onToggle: (state: boolean) => void;
} & Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange"
>;

export function ToggleInput({
    onToggle,
    onChange,
    disabled,
    ...inputProps
}: Props) {
    const [isOn, flip] = useToggle();

    if (onToggle) {
        useEffect(() => {
            onToggle(isOn);
        }, [isOn]);
    }

    return (
        <div className={style.toggleInputWrapper}>
            <InputTag
                isOn={isOn}
                disabled={!isOn || disabled}
                onChange={onChange}
                {...inputProps}
            />
            <ToggleSwitch onToggle={onToggle} isOn={isOn} flip={flip} />
        </div>
    );
}

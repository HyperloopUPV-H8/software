import { InputTag } from "components/InputTag/InputTag";
import { ToggleSwitch } from "components/ToggleSwitch/ToggleSwitch";
import { useToggle } from "hooks/useToggle";
import { DetailedHTMLProps, InputHTMLAttributes, useEffect } from "react";
import style from "./ToggleInput.module.scss";

type Props = {
    id: string;
    onChange: (state: number) => void;
    onToggle: (state: boolean) => void;
    disabled: boolean;
} & Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange" | "disabled"
>;

export function ToggleInput({
    onToggle,
    onChange,
    disabled,
    ...inputProps
}: Props) {
    const [isOn, flip] = useToggle(!disabled);

    if (onToggle) {
        useEffect(() => {
            onToggle(isOn);
        }, [isOn]);
    }

    return (
        <div className={style.toggleInputWrapper}>
            <InputTag
                isOn={isOn}
                disabled={!isOn}
                onChange={onChange}
                {...inputProps}
            />
            <ToggleSwitch onToggle={onToggle} isOn={isOn} flip={flip} />
        </div>
    );
}

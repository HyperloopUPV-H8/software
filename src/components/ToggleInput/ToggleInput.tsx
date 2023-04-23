import { InputTag } from "components/InputTag/InputTag";
import { ToggleSwitch } from "components/ToggleSwitch/ToggleSwitch";
import { useToggle } from "hooks/useToggle";
import {
    DetailedHTMLProps,
    InputHTMLAttributes,
    useEffect,
    useState,
} from "react";
import style from "./ToggleInput.module.scss";
import { InputValue } from "pages/TestingPage/TestControls/TestAttributes";

type Props = {
    //label: string;
    id: string;
    data?: (label: string, value: InputValue) => void;
    //TODO: pass data to child to recover it from form
    onChange: (state: number) => void;
    //TODO: Check if it is never undefined
    onToggle: (state: boolean) => void;
} & Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange"
>;
// type Props = {
//     label: string;
//     data?: (label: string, value: InputValue) => void;
//     //TODO: pass data to child to recover it from form
//     onChange: (state: number) => void;
//     //TODO: Check if it is never undefined
//     onToggle: (state: boolean) => void;
// } & Omit<
//     DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
//     "onChange"
// >;

export function ToggleInput({
    onToggle,
    onChange,
    disabled,
    data,
    ...inputProps
}: Props) {
    const [isOn, flip] = useToggle();

    if (onToggle) {
        useEffect(() => {
            onToggle(isOn);
            console.log(isOn);
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
            {/* <ToggleSwitch onToggle={onToggle} /> */}
            <ToggleSwitch onToggle={onToggle} isOn={isOn} flip={flip} />
        </div>
    );
}

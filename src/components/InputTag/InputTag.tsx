import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import style from "./InputTag.module.scss";

type Props = {
    label: string;
    isOn: boolean;
    onChange: (state: number) => void;
} & Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange"
>;

export function InputTag({ label, isOn, onChange, ...inputProps }: Props) {
    return (
        <fieldset
            className={
                isOn ? style.inputTagWrapperOn : style.inputTagWrapperOff
            }
        >
            <legend className={style.testInputLabel}>{label}</legend>
            <input
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    let currentNumber = Number(e.currentTarget.value);
                    if (checkString(currentNumber)) {
                        onChange(currentNumber);
                    } else {
                        //TODO: What to do is it is not a number
                        console.log("not a number");
                    }
                }}
                {...inputProps}
            ></input>
        </fieldset>
    );
}

function checkString(value: number) {
    return !isNaN(value);
}

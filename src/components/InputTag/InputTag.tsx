import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import style from "./InputTag.module.scss";
import { isNumberValid } from "common/validation";

type Props = {
    id: string;
    isOn: boolean;
    onChange: (state: number) => void;
} & Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange"
>;

export function InputTag({ id, isOn, onChange, ...inputProps }: Props) {
    return (
        <fieldset
            className={
                isOn ? style.inputTagWrapperOn : style.inputTagWrapperOff
            }
        >
            <legend className={style.testInputLabel}>{id}</legend>
            <input
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    let currentNumber = Number.parseFloat(
                        e.currentTarget.value
                    );
                    if (isNumberValid(e.currentTarget.value, "int64")) {
                        onChange(currentNumber);
                        console.log("currentNumber: " + currentNumber);
                    } else if (e.currentTarget.value == "") {
                        onChange(currentNumber);
                        console.log("currentNumber: " + currentNumber);
                    } else {
                        //TODO: don't print the key
                        console.log("not a number");
                    }
                }}
                {...inputProps}
            ></input>
        </fieldset>
    );
}

import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import style from "./InputTag.module.scss";
import { isNumberValid } from "./validation";

type Props = {
    id: string;
    isOn: boolean;
    onChange: (state: number) => void;
} & Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange"
>;

const onChangeInput = (
    e: React.FormEvent<HTMLInputElement>,
    onChange: (state: number) => void
) => {
    const currentNumber = Number.parseFloat(e.currentTarget.value);
    if (isNumberValid(e.currentTarget.value, "int64")) {
        onChange(currentNumber);
    } else if (e.currentTarget.value == "") {
        onChange(currentNumber);
    } else {
        //TODO: don't print the key in the input
    }
};

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
                    onChangeInput(e, onChange);
                }}
                {...inputProps}
            ></input>
        </fieldset>
    );
}

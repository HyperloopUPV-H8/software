import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import style from "./InputTag.module.scss";
import { isNumberValid } from "./validation";

type Props = {
    id: string;
    disabled: boolean;
    onChange: (state: number) => void;
} & Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange" | "disabled"
>;

const onChangeInput = (
    e: React.FormEvent<HTMLInputElement>,
    onChange: (state: number) => void
) => {
    const currentNumber = Number.parseFloat(e.currentTarget.value);
    if (isNumberValid(e.currentTarget.value, "float64")) {
        onChange(currentNumber);
    } else if (e.currentTarget.value == "") {
        onChange(currentNumber);
    } else {
        //TODO: don't print the key in the input
    }
};

export function InputTag({ id, disabled, onChange, ...inputProps }: Props) {
    return (
        <fieldset
            className={`${style.inputTagWrapper} ${
                disabled ? style.off : style.on
            }`}
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

import { DetailedHTMLProps, InputHTMLAttributes } from "react"
import style from "./InputTag.module.scss"

type Props = {
    label: string,
    isOn: boolean,
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export function InputTag({label, isOn, ...inputProps}: Props) {
    return (
        <fieldset className={isOn ? style.inputTagWrapperOn : style.inputTagWrapperOff}>
            <legend className={style.testInputLabel}>{label}</legend>
            <input {...inputProps}></input>
        </fieldset>
    )
}
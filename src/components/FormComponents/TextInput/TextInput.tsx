import styles from "components/FormComponents/TextInput/TextInput.module.scss";
import { FieldState } from "components/OrderTable/Orders/OrderForm/useFormFields";
import { ChangeEvent, useState } from "react";
type Props = {
    placeholder: string;
    onChange: (value: string) => void;
    isRequired: boolean;
    state: FieldState;
};

export const TextInput = ({
    onChange,
    isRequired,
    state,
    placeholder,
}: Props) => {
    return (
        <input
            type="text"
            name=""
            className={`${styles.textInput} ${
                state == (FieldState.DEFAULT || FieldState.VALID)
                    ? styles.valid
                    : styles.invalid
            }`}
            placeholder={placeholder}
            required={isRequired}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                onChange(ev.target.value);
            }}
        />
    );
};

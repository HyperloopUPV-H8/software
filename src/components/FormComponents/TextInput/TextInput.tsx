import styles from "components/FormComponents/TextInput/TextInput.module.scss";
import { FieldState } from "components/OrderTable/Orders/OrderForm/useFormFields";
import { ChangeEvent, useState } from "react";
type Props = {
    placeholder: string;
    onChange: (value: string) => void;
    isRequired: boolean;
    isEnabled: boolean;
    state: FieldState;
};

export const TextInput = ({
    onChange,
    isRequired,
    isEnabled,
    state,
    placeholder,
}: Props) => {
    return (
        <input
            type="text"
            name=""
            disabled={!isEnabled}
            className={`${styles.textInput} ${
                state == (FieldState.DEFAULT || FieldState.VALID)
                    ? styles.valid
                    : styles.invalid
            } ${!isEnabled ? styles.disabled : ""}`}
            placeholder={placeholder}
            required={isRequired}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                onChange(ev.target.value);
            }}
        />
    );
};

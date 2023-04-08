import styles from "components/FormComponents/TextInput/TextInput.module.scss";
//TODO: raise FieldState
import { FieldState } from "components/OrdersContainer/Orders/OrderForm/useFormFields";
import { ChangeEvent, useState } from "react";
type Props = {
    placeholder: string;
    onChange: (value: string) => void;
    isRequired: boolean;
    isEnabled: boolean;
    isValid: boolean;
};

export const TextInput = ({
    onChange,
    isRequired,
    isEnabled,
    isValid,
    placeholder,
}: Props) => {
    return (
        <input
            type="text"
            name=""
            disabled={!isEnabled}
            className={`${styles.textInput} ${
                isValid ? styles.valid : styles.invalid
            } ${!isEnabled ? styles.disabled : ""}`}
            placeholder={placeholder}
            required={isRequired}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                onChange(ev.target.value);
            }}
        />
    );
};

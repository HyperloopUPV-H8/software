import styles from "./Field.module.scss";
import { CheckBox } from "components/FormComponents/CheckBox/CheckBox";
import { Dropdown } from "components/FormComponents/old_Dropdown/Dropdown";
import { FormField } from "components/OrdersContainer/Orders/OrderForm/useForm";
import { NumericDescription } from "common";
import { isNumberValid } from "./validation";
import { NumericInput } from "components/FormComponents/NumericInput/NumericInput";

type Props = {
    name: string;
    field: FormField;
    onChange: (newValue: boolean | string | number, isValid: boolean) => void;
    changeEnabled: (isEnabled: boolean) => void;
};

export const Field = ({ name, field, onChange, changeEnabled }: Props) => {
    function handleTextInputChange(
        value: string,
        description: NumericDescription
    ) {
        const isValid = isNumberValid(
            value,
            description.value,
            description.safeRange
        );

        onChange(Number.parseFloat(value), isValid);
    }

    return (
        <div
            className={`${styles.fieldWrapper} ${
                !field.isEnabled ? styles.disabled : ""
            }`}
        >
            <div className={styles.name}>{name}</div>
            {field.valueDescription.kind == "numeric" ? (
                <NumericInput
                    required={field.isEnabled}
                    disabled={!field.isEnabled}
                    isValid={field.isValid}
                    placeholder={`${field.valueDescription.value}...`}
                    defaultValue={!field.isValid ? "" : (field.value as number)}
                    onChange={(value) =>
                        handleTextInputChange(
                            value,
                            field.valueDescription as NumericDescription
                        )
                    }
                />
            ) : field.valueDescription.kind == "boolean" ? (
                <CheckBox
                    isRequired={field.isEnabled}
                    disabled={!field.isEnabled}
                    onChange={(value: boolean) => {
                        onChange(value, true);
                    }}
                />
            ) : (
                <Dropdown
                    options={field.valueDescription.value}
                    defaultValue={field.value as string}
                    onChange={(newValue) => {
                        onChange(newValue, true);
                    }}
                />
            )}

            <CheckBox
                color="orange"
                isRequired={true}
                onChange={changeEnabled}
                initialValue={field.isEnabled}
            />
        </div>
    );
};

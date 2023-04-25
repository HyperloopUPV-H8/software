import styles from "./Field.module.scss";
import { TextInput } from "components/FormComponents/TextInput/TextInput";
import { CheckBox } from "components/FormComponents/CheckBox/CheckBox";
import { Dropdown } from "components/FormComponents/old_Dropdown/Dropdown";
import { FormField } from "components/OrdersContainer/Orders/OrderForm/useForm";
import { NumericDescription } from "adapters/Order";
import { isNumberValid } from "./validation";

type Props = {
    name: string;
    field: FormField;
    onChange: (newValue: boolean | string | number, isValid: boolean) => void;
    changeEnabled: (isEnabled: boolean) => void;
};

export const Field = ({ name, field, onChange, changeEnabled }: Props) => {
    function handleTextInputChange(value: string) {
        const isValid = isNumberValid(
            value,
            (field.valueDescription as NumericDescription).value
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
                <TextInput
                    placeholder={`${field.valueDescription.value}...`}
                    defaultValue={!field.isValid ? "" : (field.value as number)}
                    isRequired={field.isEnabled}
                    isEnabled={field.isEnabled}
                    isValid={field.isValid}
                    onChange={handleTextInputChange}
                ></TextInput>
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

import styles from "./OrderField.module.scss";
import { TextInput } from "components/FormComponents/TextInput/TextInput";
import { CheckBox } from "components/FormComponents/CheckBox/CheckBox";
import { Dropdown } from "components/FormComponents/Dropdown/Dropdown";
import { FieldState, FormField } from "../../useFormFields"; //TODO: mover formfield
import { NumericType } from "adapters/GolangTypes";
import { NumericValue } from "adapters/Order";
type Props = {
    name: string;
    field: FormField;
    onChange: (
        newValue: boolean | string | number,
        fieldState: FieldState
    ) => void;
};

export const OrderField = ({ name, field, onChange }: Props) => {
    return (
        <div className={styles.orderFieldWrapper}>
            <div className={styles.name}>{name}</div>
            {field.valueType.kind == "numeric" ? (
                <TextInput
                    placeholder={`${field.valueType.value}...`}
                    isRequired={true}
                    state={field.fieldState}
                    onChange={(value) => {
                        onChange(
                            Number.parseFloat(value),
                            (() => {
                                const numericFieldType =
                                    field.valueType as NumericValue;
                                return checkNumber(
                                    numericFieldType.value,
                                    value
                                )
                                    ? FieldState.VALID
                                    : FieldState.INVALID;
                            })()
                        );
                    }}
                ></TextInput>
            ) : field.valueType.kind == "boolean" ? (
                <CheckBox
                    isRequired={true}
                    onChange={(value: boolean) => {
                        onChange(value, FieldState.VALID);
                    }}
                />
            ) : (
                <Dropdown
                    options={field.valueType.value}
                    onChange={(newValue) => {
                        onChange(newValue, FieldState.VALID);
                    }}
                />
            )}
        </div>
    );
};

function checkNumber(numberType: NumericType, valueStr: string): boolean {
    const value = Number.parseFloat(valueStr);
    return !Number.isNaN(value)
        ? checkNumberOverflow(numberType, value)
        : false;
}

function checkNumberOverflow(numberType: NumericType, value: number): boolean {
    switch (numberType) {
        case "uint8":
            return getCheckNumberOverflow(8, true, false)(value);
        case "uint16":
            return getCheckNumberOverflow(16, true, false)(value);
        case "uint32":
            return getCheckNumberOverflow(32, true, false)(value);
        case "uint64":
            return getCheckNumberOverflow(64, true, false)(value);
        case "int8":
            return getCheckNumberOverflow(8, true, true)(value);
        case "int16":
            return getCheckNumberOverflow(16, true, true)(value);
        case "int32":
            return getCheckNumberOverflow(32, true, true)(value);
        case "int64":
            return getCheckNumberOverflow(64, true, true)(value);
        case "float32":
            return getCheckNumberOverflow(32, false, true)(value);
        case "float64":
            return getCheckNumberOverflow(64, false, true)(value);
    }
}

function getCheckNumberOverflow(
    bits: number,
    isInteger: boolean,
    isSigned: boolean
): (value: number) => boolean {
    if (isInteger) {
        if (isSigned) {
            return (value: number) => {
                return (
                    Number.isInteger(value) &&
                    value >= -1 << (bits - 1) &&
                    value < 1 << (bits - 1)
                );
            };
        } else {
            return (value: number) => {
                return (
                    Number.isInteger(value) && value >= 0 && value < 1 << bits
                );
            };
        }
    } else {
        return (value: number) => {
            return !Number.isNaN(value);
        };
    }
}

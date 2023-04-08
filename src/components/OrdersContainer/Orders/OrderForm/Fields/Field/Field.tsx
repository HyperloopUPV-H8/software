import styles from "./Field.module.scss";
import { TextInput } from "components/FormComponents/TextInput/TextInput";
import { CheckBox } from "components/FormComponents/CheckBox/CheckBox";
import { Dropdown } from "components/FormComponents/old_Dropdown/Dropdown";
import { FieldState, FormField as FieldData } from "../../useFormFields"; //TODO: mover formfield
import {
    NumericType,
    isSignedIntegerType,
    isUnsignedIntegerType,
} from "adapters/GolangTypes";
import { NumericValue } from "adapters/Order";
type Props = {
    name: string;
    field: FieldData;
    onChange: (newValue: boolean | string | number, isValid: boolean) => void;
    changeEnabled: (isEnabled: boolean) => void;
};

export const Field = ({ name, field, onChange, changeEnabled }: Props) => {
    function handleTextInputChange(value: string) {
        //FIXME: mergear tipos Value y ValueType o algo así
        const isValid = isNumberValid(
            value,
            (field.valueType as NumericValue).value
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
            {field.valueType.kind == "numeric" ? (
                <TextInput
                    placeholder={`${field.valueType.value}...`}
                    isRequired={field.isEnabled}
                    isEnabled={field.isEnabled}
                    isValid={field.isValid}
                    onChange={handleTextInputChange}
                ></TextInput>
            ) : field.valueType.kind == "boolean" ? (
                <CheckBox
                    isRequired={field.isEnabled}
                    disabled={!field.isEnabled}
                    onChange={(value: boolean) => {
                        onChange(value, true);
                    }}
                />
            ) : (
                <Dropdown
                    options={field.valueType.value}
                    defaultValue={field.currentValue as string}
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

function isNumberValid(valueStr: string, numberType: NumericType): boolean {
    return (
        checkNumberString(valueStr, numberType) &&
        ((isUnsignedIntegerType(numberType) &&
            checkUnsignedIntegerOverflow(
                Number.parseInt(valueStr),
                getBits(numberType)
            )) ||
            (isSignedIntegerType(numberType) &&
                checkSignedIntegerOverflow(
                    Number.parseInt(valueStr),
                    getBits(numberType)
                )) ||
            checkFloatOverflow(Number.parseFloat(valueStr)))
    );
}

function checkNumberString(valueStr: string, numberType: NumericType): boolean {
    if (isUnsignedIntegerType(numberType)) {
        return /^\d+$/.test(valueStr);
    } else if (isSignedIntegerType(numberType)) {
        return /^-?\d+$/.test(valueStr);
    } else {
        return /^-?\d+(?:\.\d+)?$/.test(valueStr);
    }
}

function checkUnsignedIntegerOverflow(value: number, bits: number): boolean {
    return value >= 0 && value < 1 << bits;
}

function checkSignedIntegerOverflow(value: number, bits: number): boolean {
    return value >= -1 << (bits - 1) && value < 1 << (bits - 1);
}

function checkFloatOverflow(value: number): boolean {
    return !Number.isNaN(value);
}

function getBits(type: NumericType): number {
    switch (type) {
        case "uint8":
            return 8;
        case "uint16":
            return 16;
        case "uint32":
            return 32;
        case "uint64":
            return 64;
        case "int8":
            return 8;
        case "int16":
            return 16;
        case "int32":
            return 32;
        case "int64":
            return 64;
        case "float32":
            return 32;
        case "float64":
            return 64;
    }
}

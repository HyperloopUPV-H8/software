import styles from "@components/TransmitTable/OrderField/OrderField.module.scss";
import { Enum, FieldDescription } from "@adapters/Order";
import { TextInput } from "@components/FormComponents/TextInput/TextInput";
import { CheckBox } from "@components/FormComponents/CheckBox/CheckBox";
import { Dropdown } from "@components/FormComponents/Dropdown/Dropdown";
type Props = {
    name: string;
    fieldDescription: FieldDescription;
    onChange: (newValue: boolean | string | number, isValid: boolean) => void;
};

export const OrderField = ({ name, fieldDescription, onChange }: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.name}>{name}</div>
            <div className={styles.formComponent}>
                {
                    {
                        TextInput: (
                            <TextInput
                                placeholder={`${fieldDescription.value}...`}
                                isRequired={true}
                                onChange={(value: string, isValid: boolean) => {
                                    onChange(Number.parseFloat(value), isValid);
                                }}
                                checkInput={getCheckInput(
                                    fieldDescription.value as string
                                )}
                            ></TextInput>
                        ),
                        CheckBox: (
                            <CheckBox
                                isRequired={true}
                                onChange={(value: boolean) => {
                                    onChange(value, true);
                                }}
                            />
                        ),
                        Dropdown: (
                            <Dropdown
                                options={fieldDescription.value as Enum}
                                onChange={(newValue) => {
                                    onChange(newValue, true);
                                }}
                            />
                        ),
                    }[getFormElement(fieldDescription)]
                }
            </div>
        </div>
    );
};

function getFormElement(fieldDescription: FieldDescription): string {
    switch (fieldDescription.type) {
        case "Default":
            switch (fieldDescription.value) {
                case "uint8":
                case "uint16":
                case "uint32":
                case "uint64":
                case "int8":
                case "int16":
                case "int32":
                case "int64":
                case "float32":
                case "float64":
                    return "TextInput";
                case "bool":
                    return "CheckBox";
            }
        case "Enum":
            return "Dropdown";
        default:
            return "TextInput";
    }
}

function getCheckInput(fieldType: string): (value: any) => boolean {
    switch (fieldType) {
        case "uint8":
            return getCheckNumber(8, true, false);
        case "uint16":
            return getCheckNumber(16, true, false);
        case "uint32":
            return getCheckNumber(32, true, false);
        case "uint64":
            return getCheckNumber(64, true, false);
        case "int8":
            return getCheckNumber(8, true, true);
        case "int16":
            return getCheckNumber(16, true, true);
        case "int32":
            return getCheckNumber(32, true, true);
        case "int64":
            return getCheckNumber(64, true, true);
        case "float32":
            return getCheckNumber(32, false, true);
        case "float64":
            return getCheckNumber(64, false, true);
        case "bool": //FIXME: revisar si esto sirve para algo
            return (value: boolean) => typeof value == "boolean";
        default:
            return (_: any) => false;
    }
}

function getCheckNumber(
    bits: number,
    isInteger: boolean,
    isSigned: boolean
): (valueStr: string) => boolean {
    if (isInteger) {
        if (isSigned) {
            return (valueStr: string) => {
                if (!/^-?\d+$/.test(valueStr)) {
                    return false;
                }
                let value = Number.parseInt(valueStr);
                return (
                    Number.isInteger(value) &&
                    value >= -1 << (bits - 1) &&
                    value < 1 << (bits - 1)
                );
            };
        } else {
            return (valueStr: string) => {
                if (!/^\d+$/.test(valueStr)) {
                    return false;
                }
                let value = Number.parseInt(valueStr);
                return (
                    Number.isInteger(value) && value >= 0 && value < 1 << bits
                );
            };
        }
    } else {
        return (valueStr: string) => {
            if (!/^-?\d+\.\d+$/.test(valueStr)) {
                return false;
            }
            let value = Number.parseFloat(valueStr);
            return !Number.isNaN(value);
        };
    }
}

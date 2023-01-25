import { OrderAdapter, OrderDescription } from "adapters/Order";
import { useState } from "react";
import { Enum, FieldDescription } from "adapters/Order";
export type Field = {
    name: string;
    description: FieldDescription;
    isValid: boolean;
    currentValue: string | number | boolean;
};

function getInitialFieldValue(
    fieldDescription: FieldDescription
): number | string | boolean {
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
                    return 0;
                case "bool":
                    return false;
            }
        case "Enum":
            return (fieldDescription.value as Enum)[0];
        default:
            return 0;
    }
}

export function useFormFields(
    fieldDescriptions: OrderDescription["fieldDescriptions"]
): [Field[], (updatedField: Field) => void, () => boolean] {
    const [fields, setFields] = useState(
        Object.entries(fieldDescriptions).map(([name, fieldDescription]) => {
            return {
                name: name,
                description: fieldDescription,
                isValid: false,
                currentValue: getInitialFieldValue(fieldDescription),
            };
        }) as Field[]
    );

    function updateField(updatedField: Field) {
        setFields((prevField) => {
            return prevField.map((field) => {
                if (field.name == updatedField.name) {
                    return updatedField;
                } else {
                    return field;
                }
            });
        });
    }

    function areFieldsValid(): boolean {
        return fields.reduce((prevValid, currentField) => {
            return prevValid && currentField.isValid;
        }, true);
    }

    return [fields, updateField, areFieldsValid];
}

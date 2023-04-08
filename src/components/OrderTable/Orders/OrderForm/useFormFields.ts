import { OrderDescription, OrderFieldDescription, Value } from "adapters/Order";
import { useState, useEffect } from "react";

export enum FieldState {
    DEFAULT,
    VALID,
    INVALID,
}

export type FormField = {
    name: string;
    valueType: Value;
    fieldState: FieldState;
    currentValue: string | boolean | number;
    isEnabled: boolean;
};

function getInitialFormFields(
    orderFields: Record<string, OrderFieldDescription>
): FormField[] {
    return Object.entries(orderFields).map(([name, fieldDescription]) => {
        if (fieldDescription.valueType.kind == "numeric") {
            return {
                name: fieldDescription.name,
                valueType: fieldDescription.valueType,
                fieldState: FieldState.INVALID,
                currentValue: 0,
                isEnabled: true,
            };
        } else if (fieldDescription.valueType.kind == "boolean") {
            return {
                name: fieldDescription.name,
                valueType: fieldDescription.valueType,
                fieldState: FieldState.VALID,
                currentValue: false,
                isEnabled: true,
            };
        } else {
            return {
                name: fieldDescription.name,
                valueType: fieldDescription.valueType,
                fieldState: FieldState.VALID,
                currentValue: fieldDescription.valueType.value[0],
                isEnabled: true,
            };
        }
    });
}

function areFieldsValid(fields: Array<FormField>): boolean {
    return fields.reduce((prevValid, currentField) => {
        return prevValid && currentField.fieldState == FieldState.VALID;
    }, true);
}

export function useFormFields(
    fieldDescriptions: Record<string, OrderFieldDescription>
) {
    const [fields, setFields] = useState<FormField[]>(
        getInitialFormFields(fieldDescriptions)
    );
    const [valid, setValid] = useState(areFieldsValid(fields));

    function updateField(updatedField: FormField) {
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

    function changeEnabled(name: string, value: boolean) {
        setFields((prevFields) => {
            return prevFields.map((field) =>
                field.name == name ? { ...field, isEnabled: value } : field
            );
        });
    }

    useEffect(() => {
        setValid(areFieldsValid(fields));
    }, [fields]);

    return [fields, updateField, changeEnabled, valid] as const;
}

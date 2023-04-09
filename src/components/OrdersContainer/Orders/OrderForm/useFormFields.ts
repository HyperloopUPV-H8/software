import { OrderFieldDescription, ValueDescription } from "adapters/Order";
import { useState, useEffect } from "react";

export enum FieldState {
    DEFAULT,
    VALID,
    INVALID,
}

export type FormField = {
    name: string;
    valueDescription: ValueDescription;
    value: string | boolean | number;
    isValid: boolean;
    isEnabled: boolean;
};

function getInitialFormFields(
    orderFields: Record<string, OrderFieldDescription>
): FormField[] {
    return Object.entries(orderFields).map(([name, fieldDescription]) => {
        if (fieldDescription.valueDescription.kind == "numeric") {
            return {
                name: fieldDescription.name,
                valueDescription: fieldDescription.valueDescription,
                value: 0,
                isValid: false,
                isEnabled: true,
            };
        } else if (fieldDescription.valueDescription.kind == "boolean") {
            return {
                name: fieldDescription.name,
                valueDescription: fieldDescription.valueDescription,
                value: false,
                isValid: true,
                isEnabled: true,
            };
        } else {
            return {
                name: fieldDescription.name,
                valueDescription: fieldDescription.valueDescription,
                value: fieldDescription.valueDescription.value[0],
                isValid: true,
                isEnabled: true,
            };
        }
    });
}

function areFieldsValid(fields: Array<FormField>): boolean {
    return fields.reduce((prevValid, currentField) => {
        return (
            prevValid &&
            ((currentField.isEnabled && currentField.isValid) ||
                !currentField.isEnabled)
        );
    }, true);
}

export function useFormFields(
    fieldDescriptions: Record<string, OrderFieldDescription>
) {
    const [fields, setFields] = useState<FormField[]>(
        getInitialFormFields(fieldDescriptions)
    );
    const [valid, setValid] = useState(areFieldsValid(fields));

    function updateField(
        name: string,
        value: string | boolean | number,
        isValid: boolean
    ) {
        setFields((prevFields) => {
            return prevFields.map((field) => {
                if (field.name == name) {
                    return { ...field, value: value, isValid: isValid };
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

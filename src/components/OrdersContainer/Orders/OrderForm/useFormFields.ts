import {
    OrderFieldDescription,
    ValueDescription,
    NumericValue,
    BooleanValue,
    EnumValue,
} from "adapters/Order";
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
    return Object.entries(orderFields).map(([_, fieldDescription]) => {
        return getFormField(fieldDescription);
    });
}

function getFormField(description: OrderFieldDescription): FormField {
    if (description.valueDescription.kind == "numeric") {
        return getNumericFormField(
            description.name,
            description.valueDescription
        );
    } else if (description.valueDescription.kind == "boolean") {
        return getBooleanFormField(
            description.name,
            description.valueDescription
        );
    } else {
        return getEnumFormField(description.name, description.valueDescription);
    }
}

function getNumericFormField(
    name: string,
    valueDescription: NumericValue
): FormField {
    return {
        name: name,
        valueDescription: valueDescription,
        value: 0,
        isValid: false,
        isEnabled: true,
    };
}
function getBooleanFormField(
    name: string,
    valueDescription: BooleanValue
): FormField {
    return {
        name: name,
        valueDescription: valueDescription,
        value: false,
        isValid: true,
        isEnabled: true,
    };
}
function getEnumFormField(
    name: string,
    valueDescription: EnumValue
): FormField {
    return {
        name: name,
        valueDescription: valueDescription,
        value: valueDescription.value[0],
        isValid: true,
        isEnabled: true,
    };
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

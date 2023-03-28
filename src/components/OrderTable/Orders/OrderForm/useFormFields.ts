import { OrderDescription, OrderFieldDescription } from "adapters/Order";
import { useState, useEffect } from "react";

export enum FieldState {
    DEFAULT,
    VALID,
    INVALID,
}

export type FormField = OrderFieldDescription & {
    fieldState: FieldState;
    currentValue: string | boolean | number;
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
            };
        } else if (fieldDescription.valueType.kind == "boolean") {
            return {
                name: fieldDescription.name,
                valueType: fieldDescription.valueType,
                fieldState: FieldState.VALID,
                currentValue: false,
            };
        } else {
            return {
                name: fieldDescription.name,
                valueType: fieldDescription.valueType,
                fieldState: FieldState.VALID,
                currentValue: "",
            };
        }
    });
}

export function useFormFields(
    fieldDescriptions: Record<string, OrderFieldDescription>
) {
    const [fields, setFields] = useState<FormField[]>(
        getInitialFormFields(fieldDescriptions)
    );
    const [valid, setValid] = useState(areFieldsValid());

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

    function areFieldsValid(): boolean {
        return fields.reduce((prevValid, currentField) => {
            return prevValid && currentField.fieldState == FieldState.VALID;
        }, true);
    }

    useEffect(() => {
        setValid(areFieldsValid());
    }, [fields]);

    return [fields, updateField, valid] as const;
}

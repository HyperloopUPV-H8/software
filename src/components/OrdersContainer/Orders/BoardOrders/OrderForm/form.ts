import {
    BooleanDescription,
    EnumDescription,
    NumericDescription,
    OrderFieldDescription,
} from "common";
import { Form, FormField, areFieldsValid } from "./useForm";

export function createForm(
    descriptions: Record<string, OrderFieldDescription>
): Form {
    const fields = Object.entries(descriptions).map(([_, fieldDescription]) => {
        return getFormField(fieldDescription);
    });

    return { fields, isValid: areFieldsValid(fields) };
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
    valueDescription: NumericDescription
): FormField {
    return {
        id: name,
        valueDescription: valueDescription,
        value: 0,
        isValid: false,
        isEnabled: true,
    };
}
function getBooleanFormField(
    name: string,
    valueDescription: BooleanDescription
): FormField {
    return {
        id: name,
        valueDescription: valueDescription,
        value: false,
        isValid: true,
        isEnabled: true,
    };
}
function getEnumFormField(
    name: string,
    valueDescription: EnumDescription
): FormField {
    return {
        id: name,
        valueDescription: valueDescription,
        value: valueDescription.value[0],
        isValid: true,
        isEnabled: true,
    };
}

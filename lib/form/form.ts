import { InputEvent, Inputs } from "./input";

export type Form = {
    id: string;
    name: string;
    fields: Field[];
    isValid: boolean;
};

export type Field = {
    [K in keyof Inputs]: AbstractField<K, Inputs[K]["value"]> & Inputs[K];
}[keyof Inputs];

type AbstractField<K extends keyof Inputs, V extends Inputs[K]["value"]> = {
    readonly id: string;
    readonly name: string;
    readonly type: K;
    validator?: (v: V) => boolean;
};

export type FieldEvent = Field extends infer A
    ? A extends { id: string }
        ? { id: string; ev: InputEvent }
        : never
    : never;

export function areFieldsValid(fields: Field[]): boolean {
    return fields.every((field) => {
        switch (field.type) {
            case "numeric":
                return field.validator?.(field.value) ?? true;
            case "boolean":
                return field.validator?.(field.value) ?? true;
            case "enum":
                return field.validator?.(field.value) ?? true;
        }
    });
}

// export function areFieldsValid(fields: Array<Field>): boolean {
//     return fields.reduce((prevValid, currentField) => {
//         return prevValid && currentField.isValid;
//     }, true);
// }

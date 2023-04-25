import { OrderFieldDescription, ValueDescription } from "adapters/Order";
import { useState, useEffect, useReducer } from "react";
import { createForm } from "./createForm";

export enum FieldState {
    DEFAULT,
    VALID,
    INVALID,
}

export type FormField = {
    id: string;
    valueDescription: ValueDescription;
    value: string | boolean | number;
    isValid: boolean;
    isEnabled: boolean;
};

export type Form = {
    fields: FormField[];
    isValid: boolean;
};

//TODO: move function somewhere else
export function areFieldsValid(fields: Array<FormField>): boolean {
    return fields.reduce((prevValid, currentField) => {
        return (
            prevValid &&
            ((currentField.isEnabled && currentField.isValid) ||
                !currentField.isEnabled)
        );
    }, true);
}

type Action = UpdateField | ChangeEnable;

type UpdateField = {
    type: "update_field";
    payload: {
        id: string;
        value: string | boolean | number;
        isValid: boolean;
    };
};
type ChangeEnable = {
    type: "change_enable";
    payload: {
        id: string;
        enable: boolean;
    };
};

function reducer(state: Form, action: Action): Form {
    switch (action.type) {
        case "update_field": {
            const fields = state.fields.map((field) => {
                if (field.id == action.payload.id) {
                    return {
                        ...field,
                        value: action.payload.value,
                        isValid: action.payload.isValid,
                    };
                } else {
                    return field;
                }
            });

            return {
                fields,
                isValid: areFieldsValid(fields),
            };
        }

        case "change_enable": {
            const fields = state.fields.map((field) =>
                field.id == action.payload.id
                    ? { ...field, isEnabled: action.payload.enable }
                    : field
            );
            return {
                fields,
                isValid: areFieldsValid(fields),
            };
        }
    }
}

export function useForm(descriptions: Record<string, OrderFieldDescription>) {
    const [form, dispatch] = useReducer(reducer, descriptions, createForm);

    const updateField = (
        id: string,
        value: string | boolean | number,
        isValid: boolean
    ) =>
        dispatch({
            type: "update_field",
            payload: { id, value, isValid },
        });

    const changeEnable = (id: string, enable: boolean) =>
        dispatch({
            type: "change_enable",
            payload: { id, enable },
        });

    return { form, updateField, changeEnable } as const;
}

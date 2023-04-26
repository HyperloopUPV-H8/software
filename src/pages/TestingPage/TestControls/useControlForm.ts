import { useEffect, useReducer, useState } from "react";

type InputData = {
    id: string;
    type: string;
    value: number | null;
    enabled: boolean;
    validity: { isValid: boolean; msg: string };
};

type ChangingValue = {
    id: string;
    value: number | null;
};

type EnablingValue = {
    id: string;
    enabled: boolean;
};

export type FormData = Array<InputData>;

export type Form = { formData: FormData; isValid: boolean };

type SubmitHandler = () => void;
type ChangeValue = (id: string, value: number) => void;
type ChangeEnable = (id: string, enable: boolean) => void;

type Action =
    | { type: "CHANGE VALUE"; payload: ChangingValue }
    | { type: "CHANGE ENABLE"; payload: EnablingValue }
    | { type: "RESET INITIAL STATE"; payload: Form };

const searchId = (form: Form, id: string): number => {
    let index = form.formData.findIndex((inputData) => inputData.id == id);
    return index;
};

const checkType = (type: string, value: number): boolean => {
    //TODO: which types?
    return true;
};

const checkIsValid = (formData: FormData): boolean => {
    const result =
        formData.reduce(
            (prev, currentInput) =>
                prev &&
                (currentInput.validity.isValid || !currentInput.enabled),
            true
        ) &&
        formData.some((input) => input.enabled) &&
        !formData.some((input) => input.enabled && !input.value);
    return result;
};

const checkValidityInputs = (initialState: Form): Form => {
    const newState = [...initialState.formData];
    newState.forEach((input) => {
        if (input.value && checkType(input.type, input.value)) {
            input = {
                ...input,
                validity: { isValid: true, msg: input.validity.msg },
            };
        } else {
            input = {
                ...input,
                validity: { isValid: false, msg: input.validity.msg },
            };
        }
    });

    let isValid = checkIsValid(newState);
    return { formData: newState, isValid: isValid };
};

const taskReducer = (state: Form, action: Action): Form => {
    switch (action.type) {
        case "CHANGE ENABLE": {
            let dataIndex = searchId(state, action.payload.id);
            const currentValues = [...state.formData];

            currentValues[dataIndex] = {
                ...currentValues[dataIndex],
                enabled: action.payload.enabled,
            };

            let isValid = checkIsValid(currentValues);

            return { formData: currentValues, isValid: isValid };
        }
        case "CHANGE VALUE": {
            let dataIndex = searchId(state, action.payload.id);
            const currentValues = [...state.formData];
            if (
                action.payload.value &&
                checkType(state.formData[dataIndex].type, action.payload.value)
            ) {
                currentValues[dataIndex] = {
                    ...currentValues[dataIndex],
                    value: action.payload.value,
                    validity: { isValid: true, msg: "" },
                };
            } else {
                currentValues[dataIndex] = {
                    ...currentValues[dataIndex],
                    value: null,
                    validity: { isValid: false, msg: "" },
                };
            }

            let isValid = checkIsValid(currentValues);
            return { formData: currentValues, isValid: isValid };
        }
        case "RESET INITIAL STATE": {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export function useControlForm(
    initialState: Form
): [Form, ChangeValue, ChangeEnable, SubmitHandler] {
    const [form, dispatch] = useReducer(
        taskReducer,
        initialState,
        checkValidityInputs
    );

    const ChangeValue: ChangeValue = (id, value) => {
        dispatch({ type: "CHANGE VALUE", payload: { id, value } });
    };

    const ChangeEnable: ChangeEnable = (id, enabled) => {
        dispatch({ type: "CHANGE ENABLE", payload: { id, enabled } });
    };

    const ResetInitialState = () => {
        dispatch({ type: "RESET INITIAL STATE", payload: initialState });
    };

    const SubmitHandler: SubmitHandler = () => {
        if (form.isValid) {
            //TODO: take the data, send FormData al backend? To be defined
        }
    };

    useEffect(() => {
        ResetInitialState();
    }, [initialState]);

    return [form, ChangeValue, ChangeEnable, SubmitHandler];
}

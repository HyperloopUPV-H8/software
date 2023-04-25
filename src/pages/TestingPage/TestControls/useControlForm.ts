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
type SubmitHandler = () => void;
type ChangeValue = (id: string, value: number) => void;
type ChangeEnable = (id: string, enable: boolean) => void;

type Action =
    | { type: "CHANGE VALUE"; payload: ChangingValue }
    | { type: "CHANGE ENABLE"; payload: EnablingValue }
    | { type: "RESET INITIAL STATE"; payload: FormData };

const searchId = (form: FormData, id: string): number => {
    let index = form.findIndex((inputData) => inputData.id == id);
    return index;
};

const checkType = (type: string, value: number): boolean => {
    switch (
        type
        //TODO: which types?
    ) {
    }

    return true;
};

const taskReducer = (state: FormData, action: Action) => {
    switch (action.type) {
        case "CHANGE ENABLE": {
            let dataIndex = searchId(state, action.payload.id);
            const currentValues = [...state];

            currentValues[dataIndex] = {
                ...currentValues[dataIndex],
                enabled: action.payload.enabled,
            };

            return currentValues;
        }
        case "CHANGE VALUE": {
            let dataIndex = searchId(state, action.payload.id);
            const currentValues = [...state];
            if (
                action.payload.value &&
                checkType(state[dataIndex].type, action.payload.value)
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

            return currentValues;
        }
        case "RESET INITIAL STATE": {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

const checkInitialIsValid = (form: FormData): boolean => {
    let isValid = true;
    let numDisabled = 0;
    form.forEach((inputData) => {
        if (inputData.enabled) {
            if (
                !inputData.value ||
                !checkType(inputData.type, inputData.value)
            ) {
                isValid = false;
                console.log("Hay error en los valores");
            }
        } else {
            numDisabled++;
        }
    });
    console.log(numDisabled);
    console.log(form.length);
    if (numDisabled == form.length) {
        isValid = false;
    }
    console.log("checkIsValid: " + isValid);
    return isValid;
};

export function useControlForm(
    initialState: FormData
): [FormData, boolean, ChangeValue, ChangeEnable, SubmitHandler] {
    const [form, dispatch] = useReducer(taskReducer, initialState);
    const [isValid, setIsValid] = useState(checkInitialIsValid(form));

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
        console.log(form);
        form.forEach((inputData) => {
            if (inputData.enabled) {
                if (
                    inputData.value &&
                    checkType(inputData.type, inputData.value)
                ) {
                    //TODO: take the data, send FormData al backend
                    console.log(inputData.value);
                } else {
                    console.log("Hay error en los valores");
                }
            }
        });
    };

    useEffect(() => {
        ResetInitialState();
    }, [initialState]);

    useEffect(() => {
        setIsValid(true);
        form.forEach((inputData) => {
            if (inputData.enabled && inputData.validity.isValid == false) {
                console.log("llega a setFalse");
                setIsValid(false); //TODO: Sí que llega, por qué no funciona?
            }
            console.log(inputData.id + " " + inputData.value);
            console.log(inputData.id + " " + inputData.validity.isValid);
        });
        console.log("isValid Hook: " + isValid);
    }, [form]);

    return [form, isValid, ChangeValue, ChangeEnable, SubmitHandler];
}

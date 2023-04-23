import { useEffect, useReducer } from "react";

type InputData = {
    id: string;
    type: string;
    value: number | null; // null cuando este vacio
    enabled: boolean;
    validity: { isValid: boolean; msg: string }; //do not know use
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
    console.log(index);
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
            if (
                action.payload.value &&
                checkType(state[dataIndex].type, action.payload.value)
            ) {
                const currentValues = [...state];
                currentValues[dataIndex] = {
                    ...currentValues[dataIndex],
                    value: action.payload.value,
                };
                return currentValues;
            }
            return [...state];
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
    initialState: FormData
): [FormData, ChangeValue, ChangeEnable, SubmitHandler] {
    const [form, dispatch] = useReducer(taskReducer, initialState);

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
        let error = false;
        form.forEach((inputData) => {
            if (inputData.enabled) {
                if (
                    inputData.value &&
                    checkType(inputData.type, inputData.value)
                ) {
                    //TODO: take the data, send FormData al backend
                    console.log(inputData.value);
                } else {
                    error = true;
                    console.log("Hay error en los valores");
                    //TODO: Cómo proceder? botón deshabilitado si no es correcto, que todos los campos habilitados estan bien
                }
            }
        });
    };

    useEffect(() => {
        ResetInitialState();
    }, [initialState]);

    return [form, ChangeValue, ChangeEnable, SubmitHandler];
}

import { Action, Form, FormData, InputData } from "./TestAttributes";

const searchId = (form: Form, id: string): number => {
    return form.formData.findIndex((inputData) => inputData.id == id);
};

const checkType = (type: string, value: number): boolean => {
    //TODO: which types?
    return true;
};

const isFormValid = (formData: FormData): boolean => {
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

export const checkValidityInitialInputs = (initialState: Form): Form => {
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

    return { formData: newState, isValid: isFormValid(newState) };
};

const changeSingleValue = (
    inputData: InputData,
    value: number | null
): InputData => {
    if (value && checkType(inputData.type, value)) {
        inputData = {
            ...inputData,
            value: value,
            validity: {
                isValid: true,
                msg: inputData.validity.msg,
            },
        };
    } else {
        inputData = {
            ...inputData,
            value: null,
            validity: {
                isValid: false,
                msg: inputData.validity.msg,
            },
        };
    }
    return inputData;
};

export const taskReducer = (state: Form, action: Action): Form => {
    switch (action.type) {
        case "CHANGE_ENABLE": {
            const dataIndex = searchId(state, action.payload.id);
            const newFormData = [...state.formData];

            newFormData[dataIndex] = {
                ...newFormData[dataIndex],
                enabled: action.payload.enabled,
            };

            return {
                formData: newFormData,
                isValid: isFormValid(newFormData),
            };
        }
        case "CHANGE_VALUE": {
            const dataIndex = searchId(state, action.payload.id);
            const newFormData = [...state.formData];
            newFormData[dataIndex] = changeSingleValue(
                newFormData[dataIndex],
                action.payload.value
            );

            return {
                formData: newFormData,
                isValid: isFormValid(newFormData),
            };
        }
        case "RESET_INITIAL_STATE": {
            return action.payload;
        }
    }
};

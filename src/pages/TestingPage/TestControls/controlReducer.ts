import { Action, Form, FormData } from "./TestAttributes";

const searchId = (form: Form, id: string): number => {
    return form.formData.findIndex((inputData) => inputData.id == id);
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

export const checkValidityInputs = (initialState: Form): Form => {
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

    return { formData: newState, isValid: checkIsValid(newState) };
};

export const taskReducer = (state: Form, action: Action): Form => {
    switch (action.type) {
        case "CHANGE_ENABLE": {
            const dataIndex = searchId(state, action.payload.id);
            const newFormData = [...state.formData];
            let validity = true;
            if (!action.payload.enabled) {
                validity = false;
            }

            newFormData[dataIndex] = {
                ...newFormData[dataIndex],
                enabled: action.payload.enabled,
                validity: {
                    isValid: validity,
                    msg: newFormData[dataIndex].validity.msg,
                },
            };

            let isValid = checkIsValid(newFormData);

            return { formData: newFormData, isValid: isValid };
        }
        case "CHANGE_VALUE": {
            const dataIndex = searchId(state, action.payload.id);
            const newFormData = [...state.formData];
            if (
                action.payload.value &&
                checkType(state.formData[dataIndex].type, action.payload.value)
            ) {
                newFormData[dataIndex] = {
                    ...newFormData[dataIndex],
                    value: action.payload.value,
                    validity: {
                        isValid: true,
                        msg: newFormData[dataIndex].validity.msg,
                    },
                };
            } else {
                newFormData[dataIndex] = {
                    ...newFormData[dataIndex],
                    value: null,
                    validity: {
                        isValid: false,
                        msg: newFormData[dataIndex].validity.msg,
                    },
                };
            }

            return {
                formData: newFormData,
                isValid: checkIsValid(newFormData),
            };
        }
        case "RESET_INITIAL_STATE": {
            return action.payload;
        }
    }
};

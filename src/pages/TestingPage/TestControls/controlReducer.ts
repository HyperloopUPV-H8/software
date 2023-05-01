import { isNumberValid } from "components/InputTag/validation";
import {
    Action,
    Form,
    FormData,
    FormDescription,
    InputData,
    InputDescription,
} from "./TestAttributes";

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

export const createFormFromDescription = (
    initialState: FormDescription
): Form => {
    const newState: FormData = [];
    initialState.map((input) => {
        if (input.value && checkType(input.type, input.value)) {
            const inputData: InputData = {
                ...input,
                enabled: true,
                validity: { isValid: true, msg: "" },
            };
            newState.push(inputData);
        } else {
            const inputData: InputData = {
                ...input,
                enabled: false,
                validity: { isValid: false, msg: "incorrect initial value" },
            };
            newState.push(inputData);
        }
    });

    return { formData: newState, isValid: isFormValid(newState) };
};

const changeSingleValue = (
    inputData: InputData,
    value: number | null
): InputData => {
    const isValid = value && checkType(inputData.type, value) ? true : false;

    return {
        ...inputData,
        value: value,
        validity: {
            isValid: isValid,
            msg: isValid
                ? "correct onChange update"
                : "NOT correct onChange update",
        },
    };
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
            return createFormFromDescription(action.payload);
        }
    }
};

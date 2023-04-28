import { useEffect, useReducer, useState } from "react";
import {
    Form,
    ChangeValue,
    ChangeEnable,
    SubmitHandler,
} from "./TestAttributes";
import { checkValidityInputs, taskReducer } from "./controlReducer";

export function useControlForm(
    initialState: Form
): [Form, ChangeValue, ChangeEnable, SubmitHandler] {
    const [form, dispatch] = useReducer(
        taskReducer,
        initialState,
        checkValidityInputs
    );

    const ChangeValue: ChangeValue = (id, value) => {
        dispatch({ type: "CHANGE_VALUE", payload: { id, value } });
    };

    const ChangeEnable: ChangeEnable = (id, enabled) => {
        dispatch({ type: "CHANGE_ENABLE", payload: { id, enabled } });
    };

    const ResetInitialState = () => {
        dispatch({ type: "RESET_INITIAL_STATE", payload: initialState });
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

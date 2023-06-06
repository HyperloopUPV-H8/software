import { useEffect, useReducer, useState } from "react";
import {
    Form,
    ChangeValue,
    ChangeEnable,
    SubmitHandler,
    FormDescription,
} from "./TestAttributes";
import { createFormFromDescription, taskReducer } from "./controlReducer";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

export function useControlForm(
    initialState: FormDescription
): [Form, ChangeValue, ChangeEnable, SubmitHandler] {
    const [form, dispatch] = useReducer(
        taskReducer,
        initialState,
        createFormFromDescription
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

    const SubmitHandler: SubmitHandler = (sendJsonMessage: SendJsonMessage) => {
        if (form.isValid) {
            sendJsonMessage(form.formData);
        }
    };

    useEffect(() => {
        ResetInitialState();
    }, [initialState]);

    return [form, ChangeValue, ChangeEnable, SubmitHandler];
}

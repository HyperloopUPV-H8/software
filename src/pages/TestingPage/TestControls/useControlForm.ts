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
type SubmitHandler = (cb: () => void) => void;
type ChangeValue = (id: string, value: number) => void;
type ChangeEnable = (id: string, enable: boolean) => void;

type Action =
    | { type: "CHANGE VALUE"; payload: ChangingValue }
    | { type: "CHANGE ENABLE"; payload: EnablingValue }
    | { type: "RESET INITIAL STATE"; payload: FormData };

//const initialState: FormData = [];

const searchId = (form: FormData, id: string): number => {
    return 0;
    //TODO: return form.findIndex((inputData) => inputData.id == id);
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
            //TODO: let dataIndex = searchId(state, action.payload.id); //and if it doesn't exists?
            let dataIndex = 0;
            const currentValues = state;
            console.log(state);
            //const currentValues = [...state];

            currentValues[dataIndex] = {
                ...currentValues[dataIndex],
                enabled: action.payload.enabled,
            };

            return currentValues;
        }
        case "CHANGE VALUE": {
            let dataIndex = 0;
            //TODO: let dataIndex = searchId(state, action.payload.id); //and if it doesn't exists?
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
            //TODO: [...state];
        }
        case "RESET INITIAL STATE": {
            return action.payload;
        }
        default: {
            return state;
        }
    }
    //}
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

    const SubmitHandler: SubmitHandler = (cb) => {
        //TODO: create submitHandler
        let error = false;
        form.forEach((inputData) => {
            if (inputData.enabled) {
                //TODO: It doesn't check the type if it is not used
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
/**
 * Usar useReducer para el formData en vez de useState
 *
 * Las acciones del useReducer serán las siguientes:
 *      - ChangeEnable: recibe el valor de enable y el id del field
 *      - ChangeValue: recibe el valor del field y el id del field
 *        Tienes que comprobar la validez del valor antes de actualizar la lista.
 *
 * Para comprobar la validez del valor te basas en la propiedad "type" del tipo InputData.
 * Los momentos en los que tienes que comprobar la validez de los campos es dentro del
 * ChangeValue (es decir, cuando un usuario cambia el valor de un campo) y cuando se haga un submit.
 * En el ChangeValue solo compruebas la validez del campo que vas a actualizar mientras que en
 * el submit compruebas la validez de todos los campos. La comprobación en el submit se hace por si
 * hay algún campo vacio.
 *
 */

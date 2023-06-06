import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

export type InputDescription = {
    id: string;
    type: string;
    value: number | null;
};

export type FormDescription = Array<InputDescription>;

export type InputData = InputDescription & {
    enabled: boolean;
    validity: { isValid: boolean; msg: string };
};

export type ChangingValue = {
    id: string;
    value: number | null;
};

export type EnablingValue = {
    id: string;
    enabled: boolean;
};

export type FormData = Array<InputData>;

export type Form = { formData: FormData; isValid: boolean };

export type SubmitHandler = (sendJsonMessage: SendJsonMessage) => void;
export type ChangeValue = (id: string, value: number) => void;
export type ChangeEnable = (id: string, enable: boolean) => void;

export type Action =
    | { type: "CHANGE_VALUE"; payload: ChangingValue }
    | { type: "CHANGE_ENABLE"; payload: EnablingValue }
    | { type: "RESET_INITIAL_STATE"; payload: FormDescription };

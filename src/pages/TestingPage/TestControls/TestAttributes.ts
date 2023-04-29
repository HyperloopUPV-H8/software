export type InputData = {
    id: string;
    type: string;
    value: number | null;
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

export type SubmitHandler = () => void;
export type ChangeValue = (id: string, value: number) => void;
export type ChangeEnable = (id: string, enable: boolean) => void;

export type Action =
    | { type: "CHANGE_VALUE"; payload: ChangingValue }
    | { type: "CHANGE_ENABLE"; payload: EnablingValue }
    | { type: "RESET_INITIAL_STATE"; payload: Form };

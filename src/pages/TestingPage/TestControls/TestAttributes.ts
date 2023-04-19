export type InputValue = string | number | null;

export type ToggleInputAttributes = {
    label: string;
    type: string;
    min: number;
    max: number;
    step: number;
    value?: InputValue;
};

export type TestAttributes = Record<string, ToggleInputAttributes>;

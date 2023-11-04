import {
    CheckBox,
    Dropdown,
    ExpandablePairs,
    NumericInput,
} from "../../../../../..";
import { Inputs, InputEvent } from "../../../../../../..";

type InputData = {
    [K in keyof Inputs]: { type: K } & Inputs[K];
}[keyof Inputs];

type Props<I extends InputData> = {
    input: I;
    onChange: (type: InputEvent) => void;
};

export const Input = <I extends InputData>({ input, onChange }: Props<I>) => {
    switch (input.type) {
        case "numeric":
            return (
                <NumericInput
                    {...input}
                    placeholder={`${input.placeholder}...`}
                    onChange={(v) => onChange({ type: "numeric", value: v })}
                />
            );
        case "boolean":
            return (
                <CheckBox
                    {...input}
                    onChange={(v) => onChange({ type: "boolean", value: v })}
                />
            );
        case "enum":
            return (
                <Dropdown
                    {...input}
                    onChange={(v) => onChange({ type: "enum", value: v })}
                />
            );
        case "expandablePairs":
            return (
                <ExpandablePairs
                    {...input}
                    leftColumnName="Position"
                    rightColumnName="Velocity"
                    onChange={(v) => {}}
                />
            );
    }
};

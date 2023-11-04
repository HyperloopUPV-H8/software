import { useEffect, useState } from "react";
import { TextInput } from "../TextInput/TextInput";

function getUnion(arr: string[]): string {
    return arr.map((value) => `(?:${value})`).join("|");
}

const numericInputKeyRegex = (() => {
    const arrows = ["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"];
    const controlKeys = ["Delete", "Backspace", "Home", "End"]; // Home es inicio
    const chars = "[0-9.+-]";

    const regexp = chars + "|" + getUnion(arrows) + "|" + getUnion(controlKeys);

    return new RegExp(regexp);
})();

type Props = {
    value: number | null;
    required?: boolean;
    defaultValue?: number | string;
    placeholder?: string;
    disabled?: boolean;
    isValid?: boolean;
    className?: string;
    onChange?: (value: number | null) => void;
};

export const NumericInput = ({
    value,
    onChange = () => {},
    required = true,
    disabled = false,
    isValid = true,
    placeholder = "Enter number",
    className,
}: Props) => {
    const [number, setNumber] = useState<number | null>(value);

    useEffect(() => {
        onChange(number);
    }, [number]);

    return (
        <TextInput
            className={className}
            defaultValue={value ?? ""}
            isValid={isValid && number !== null}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            onKeyDown={(ev) => {
                if (!numericInputKeyRegex.test(ev.key)) {
                    ev.preventDefault();
                    return false;
                }
            }}
            onChange={(ev) => {
                if (ev.target.value == "") {
                    setNumber(null);
                } else if (isNumber(ev.target.value)) {
                    setNumber(parseFloat(ev.target.value));
                }
            }}
        />
    );
};

function isNumber(str: string): boolean {
    return /^-?\d+(?:\.\d+)?$/.test(str);
}

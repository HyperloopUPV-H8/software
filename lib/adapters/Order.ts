import { NumericType } from "../BackendTypes";

export type OrderDescription = {
    readonly id: number;
    readonly name: string;
    readonly fields: Record<string, OrderFieldDescription>;
};

export type OrderFieldDescription = {
    readonly name: string;
    readonly valueDescription: ValueDescription;
};

export type ValueDescription =
    | EnumDescription
    | NumericDescription
    | BooleanDescription;

export type EnumDescription = {
    readonly kind: "enum";
    readonly value: string[];
};

export type NumericDescription = {
    readonly kind: "numeric";
    readonly value: NumericType;
    readonly safeRange: [number | null, number | null];
    readonly warningRange: [number | null, number | null];
};

export type BooleanDescription = {
    readonly kind: "boolean";
};

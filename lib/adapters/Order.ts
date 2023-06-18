import { NumericType } from "../BackendTypes";

export type OrderDescription = {
    readonly id: number;
    readonly name: string;
    readonly fields: Record<string, OrderFieldDescription>;
};

export type OrderFieldDescription =
    | EnumDescription
    | NumericDescription
    | BooleanDescription;

export type EnumDescription = {
    readonly kind: "enum";
    readonly id: string;
    readonly name: string;
    readonly options: string[];
};

export type NumericDescription = {
    readonly kind: "numeric";
    readonly id: string;
    readonly name: string;
    readonly type: NumericType;
    readonly safeRange: [number | null, number | null];
    readonly warningRange: [number | null, number | null];
};

export type BooleanDescription = {
    readonly kind: "boolean";
    readonly id: string;
    readonly name: string;
};

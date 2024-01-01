import { NumericType } from "../BackendTypes";

export type OrderDescription = {
    readonly id: number;
    readonly name: string;
    readonly fields: Record<string, OrderFieldDescription>;
};

type AbstractFieldDescription = {
    readonly id: string;
    readonly name: string;
};

export type OrderFieldDescription =
    | NumericDescription
    | BooleanDescription
    | EnumDescription;
// | ArrayDescription;

export type NumericDescription = AbstractFieldDescription & {
    readonly kind: "numeric";

    readonly type: NumericType;
    readonly safeRange: [number | null, number | null];
    readonly warningRange: [number | null, number | null];
};

export type BooleanDescription = AbstractFieldDescription & {
    readonly kind: "boolean";
    readonly type: "bool";
};

export type EnumDescription = AbstractFieldDescription & {
    readonly kind: "enum";
    readonly options: string[];
    readonly type: "enum";
};

// export type ArrayDescription = AbstractFieldDescription & {
//     readonly kind: "array";
//     readonly itemType: NumericType | Bool;
// };

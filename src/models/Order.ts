export type Order = {
    id: number;
    fields: Record<string, OrderField>;
};

type OrderField = {
    value: string | number | boolean;
    isEnabled: boolean;
};

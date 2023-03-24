export type Order = {
    id: number;
    name: string;
    fields: Record<string, string | number | boolean>;
};

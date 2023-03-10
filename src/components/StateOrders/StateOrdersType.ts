export type Order = {
    name: string;
    id: number;
};

export type StateAndOrders = {
    state: string;
    actions: Order[];
};

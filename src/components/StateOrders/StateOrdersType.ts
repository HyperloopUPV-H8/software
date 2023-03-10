export type BoardState = "OPERATIONAL" | "FAULT" | "HEALTH_CHECK";

export type Order = {
    name: string;
    id: number;
};

export type StateAndOrders = {
    state: BoardState;
    actions: Order[];
};

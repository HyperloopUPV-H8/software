import { BoardOrders, Order } from "common";

export const hardcodedOrders: BoardOrders[] = [
    {
        name: "",
        orders: [
            { id: 12, name: "Break", fields: {} },
            { id: 12, name: "Unbreak", fields: {} },
            { id: 12, name: "Start levitation", fields: {} },
            { id: 12, name: "Turn on EMS", fields: {} },
            { id: 12, name: "Enable emergency tape", fields: {} },
            { id: 12, name: "Disable emergency tape", fields: {} },
            { id: 12, name: "Set reference pressure", fields: {} },
            { id: 12, name: "Start motor control", fields: {} },
            { id: 12, name: "Toggle VCU", fields: {} },
            { id: 12, name: "Reset VCU", fields: {} },
            { id: 12, name: "Toggle OBCCU", fields: {} },
            { id: 12, name: "Reset OBCCU", fields: {} },
            { id: 12, name: "Toggle BMSL", fields: {} },
            { id: 12, name: "Reset BMSL", fields: {} },
            { id: 12, name: "Toggle PCU", fields: {} },
            { id: 12, name: "Reset PCU", fields: {} },
            { id: 12, name: "Toggle LCU_MASTER", fields: {} },
            { id: 12, name: "Reset LCU_MASTER", fields: {} },
        ],
        stateOrders: [],
    },
];

export const RestartOrder: Order = {
    id: 203,
    fields: {},
};

export const StopOrder: Order = {
    id: 203,
    fields: {},
};

export const BrakeOrder: Order = {
    id: 203,
    fields: {},
};

export const OpenContactorsOrder: Order = {
    id: 203,
    fields: {},
};

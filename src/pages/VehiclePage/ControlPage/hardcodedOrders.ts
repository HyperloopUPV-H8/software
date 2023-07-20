import { BoardOrders, Order } from "common";

export const hardcodedOrders: BoardOrders[] = [
    {
        name: "",
        orders: [
            { id: 215, name: "Break", fields: {} },
            { id: 216, name: "Unbreak", fields: {} },
            { id: 300, name: "Start levitation", fields: {} },
            { id: 12, name: "Turn on EMS", fields: {} },
            { id: 218, name: "Enable emergency tape", fields: {} },
            { id: 217, name: "Disable emergency tape", fields: {} },
            { id: 210, name: "Set reference pressure", fields: {} },
            // { id: 12, name: "Start motor control", fields: {} },
            // { id: 12, name: "Toggle VCU", fields: {} },
            // { id: 12, name: "Reset VCU", fields: {} },
            // { id: 12, name: "Toggle OBCCU", fields: {} },
            // { id: 12, name: "Reset OBCCU", fields: {} },
            // { id: 12, name: "Toggle BMSL", fields: {} },
            // { id: 12, name: "Reset BMSL", fields: {} },
            // { id: 12, name: "Toggle PCU", fields: {} },
            // { id: 12, name: "Reset PCU", fields: {} },
            // { id: 12, name: "Toggle LCU_MASTER", fields: {} },
            // { id: 12, name: "Reset LCU_MASTER", fields: {} },
        ],
        stateOrders: [],
    },
];

export const RestartVcuOrder: Order = {
    id: 209,
    fields: {},
};

export const RestartPcuOrder: Order = {
    id: 602,
    fields: {},
};

export const RestartObccuOrder: Order = {
    id: 906,
    fields: {},
};

export const RestartLcuMasterOrder: Order = {
    id: 236,
    fields: {},
};

export const RestartBmslOrder: Order = {
    id: 804,
    fields: {},
};

export const RestartOrders = [
    RestartVcuOrder,
    RestartPcuOrder,
    RestartObccuOrder,
    RestartLcuMasterOrder,
    RestartBmslOrder,
];

export const StopOrder: Order = {
    id: 200,
    fields: {},
};

export const BrakeOrder: Order = {
    id: 215,
    fields: {},
};

export const OpenContactorsOrder: Order = {
    id: 902,
    fields: {},
};

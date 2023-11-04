import { BoardOrders, Order, OrderDescription } from "common";

export const hardcodedOrderToId = {
    set_regulator_pressure: 210,
    brake: 215,
    unbrake: 216,
    disable_emergency_tape: 217,
    enable_emergency_tape: 218,
    test_current_control: 335,
    open_contactors: 902,
    close_contactors: 903,
    take_off: 300,
    test_svppwm: 615,
    stop_lcu_control: 316,
    stop_pcu_control: 609,
};

export function getHardcodedOrders(boardOrders: BoardOrders[]): BoardOrders[] {
    const foundOrders = [] as OrderDescription[];
    const wantedOrdersIds = Object.values(hardcodedOrderToId);
    for (const board of boardOrders) {
        for (const order of board.orders) {
            if (wantedOrdersIds.includes(order.id)) {
                foundOrders.push(order);
            }
        }
        for (const stateOrder of board.stateOrders) {
            if (wantedOrdersIds.includes(stateOrder.id)) {
                foundOrders.push(stateOrder);
            }
        }
    }

    return [{ name: "", orders: foundOrders, stateOrders: [] }];
}

export const hardcodedOrders: BoardOrders[] = [
    {
        name: "",
        orders: [
            {
                id: 210,
                name: "Set reference pressure",
                fields: {
                    new_reference_pressure: {
                        id: "new_reference_pressure",
                        kind: "numeric",
                        name: "New reference pressure",
                        safeRange: [0, 10],
                        warningRange: [0, 10],
                        type: "float32",
                    },
                },
            },
            { id: 215, name: "Brake", fields: {} },
            { id: 216, name: "Unbrake", fields: {} },
            { id: 217, name: "Disable emergency tape", fields: {} },
            { id: 218, name: "Enable emergency tape", fields: {} },

            { id: 335, name: "Test current control", fields: {} },
            // { id: 217, name: "Disable emergency tape", fields: {} },
            // { id: 218, name: "Enable emergency tape", fields: {} },
            // { id: 215, name: "Brake", fields: {} },
            // { id: 216, name: "Unbrake", fields: {} },
            // { id: 210, name: "Set reference pressure", fields: {} },
            // { id: 200, name: "Emergency stop", fields: {} },
            // { id: 209, name: "Reset VCU", fields: {} },
            // { id: 316, name: "Stop LCU control", fields: {} },
            // { id: 326, name: "Reset all LCUs", fields: {} },
        ],
        stateOrders: [],
    },
];

export const ResetVehicleOrder: Order = {
    id: 250,
    fields: {},
};

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

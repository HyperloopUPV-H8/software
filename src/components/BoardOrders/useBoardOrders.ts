import {
    Field,
    Form,
    NumericType,
    OrderFieldDescription,
    StateOrder,
    isNumberValid,
    useSubscribe,
} from "common";
import { useDispatch, useSelector } from "react-redux";
import { updateStateOrders } from "slices/ordersSlice";
import { RootState } from "store";

export function useBoardOrders(name: string) {
    const dispatch = useDispatch();

    useSubscribe("order/stateOrders", (msg) => {
        dispatch(updateStateOrders(msg));
    });

    return useSelector(
        (state: RootState) =>
            state.orders.boards.find((board) => board.name == name)
                ?.stateOrders ?? []
    );
}

export function createFormFromOrder(order: StateOrder): Omit<Form, "isValid"> {
    if (order.id == 601) {
        return {
            id: order.id.toString(),
            name: order.name,
            fields: [
                {
                    id: "myId",
                    name: "Travel path",
                    type: "expandablePairs",
                    value: [
                        [null, null],
                        [null, null],
                        [null, null],
                    ],
                },
            ],
        };
    }

    const fields = Object.values(order.fields).map((desc) => {
        return getField(desc);
    });

    return {
        id: order.id.toString(),
        name: order.name,
        fields: fields,
    };
}

function getField(desc: OrderFieldDescription): Field {
    switch (desc.kind) {
        case "boolean":
            return {
                id: desc.id,
                name: desc.name,
                type: "boolean",
                value: false,
            };
        case "enum":
            return {
                id: desc.id,
                name: desc.name,
                type: "enum",
                options: desc.options,
                value: desc.options[0] ?? "Default",
            };
        case "numeric":
            return {
                id: desc.id,
                name: desc.name,
                type: "numeric",
                value: null,
                placeholder: desc.type,
                isValid: false,
                validator: getNumericValidator(desc.type, desc.safeRange),
            };
    }
}

function getNumericValidator(
    type: NumericType,
    range: [number | null, number | null]
): (v: number | null) => boolean {
    return (v: number | null) => {
        if (!v) {
            return false;
        }

        let result = true;
        result &&= isNumberValid(v, type);
        result &&= range[0] ? range[0] <= v : result;
        result &&= range[1] ? range[1] >= v : result;
        return result;
    };
}

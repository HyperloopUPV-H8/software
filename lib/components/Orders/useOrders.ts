import { useDispatch, useSelector } from "react-redux";
import {
    Field,
    Form,
    NumericType,
    OrderDescription,
    OrderFieldDescription,
    orderSlice,
    useSubscribe,
} from "../..";
import {
    doesNumberOverflow,
    isNumberValid,
    isWithinRange,
} from "../../numberValidation";

export function useOrders() {
    const dispatch = useDispatch();

    useSubscribe("order/stateOrders", (msg) => {
        dispatch(orderSlice.actions.updateStateOrders(msg));
    });

    return useSelector(
        (state: { orders: ReturnType<typeof orderSlice.getInitialState> }) =>
            state.orders.boards
    );
}

export function createFormFromOrder(
    order: OrderDescription
): Omit<Form, "isValid"> {
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
        if (v === null) {
            return false;
        }

        let result = true;
        result &&= doesNumberOverflow(v, type);
        result &&= isWithinRange(v, range);
        return result;
    };
}

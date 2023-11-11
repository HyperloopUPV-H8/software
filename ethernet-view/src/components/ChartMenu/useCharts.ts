import { useReducer } from "react";
import { ChartInfo } from "./types";

type AddChart = {
    type: "add_element";
    payload: ChartInfo;
};

type RemoveChart = {
    type: "remove_element";
    payload: string;
};

type ChartActions = AddChart | RemoveChart

function reducer(state: ChartInfo[], action: ChartActions): ChartInfo[] {
    switch (action.type) {
        //TODO: Check if is already in the list
        case "add_element":
            return [
                ...state,
                action.payload,
            ];
        case "remove_element": {
            const newElements = [...state];
            return newElements.filter(
                (element) => element.id != action.payload
            );
        }
    }
}

// Custom hook that keeps the information of the charts and methods to add and remove them.
// It doesn't return charts out of the box, but it returns information to create them.
export function useCharts() {
    const [charts, dispatch] = useReducer(reducer, []);

    return {
        charts,
        addChart: (chartInfo: ChartInfo) =>
            dispatch({ type: "add_element", payload: chartInfo }),
        removeChart: (id: string) =>
            dispatch({ type: "remove_element", payload: id }),
    };
}

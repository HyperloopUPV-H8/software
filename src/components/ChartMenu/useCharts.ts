import { useReducer } from "react";
import { ChartElement, ChartLine } from "./ChartElement";
import { LineDescription } from "common";
import { mustFindIndex } from "utils/array";

type AddElement = {
    type: "add_element";
    payload: { id: string; line: ChartLine };
};

type RemoveElement = {
    type: "remove_element";
    payload: string;
};

type AddLine = {
    type: "add_line";
    payload: { chartId: string; line: ChartLine };
};

type RemoveLine = {
    type: "remove_line";
    payload: { chartId: string; lineId: string };
};

type ChartActions = AddElement | RemoveElement | AddLine | RemoveLine;

function reducer(state: ChartElement[], action: ChartActions): ChartElement[] {
    switch (action.type) {
        case "add_element":
            return [
                ...state,
                { id: action.payload.id, lines: [action.payload.line] },
            ];
        case "remove_element": {
            const newElements = [...state];
            return newElements.filter(
                (element) => element.id != action.payload
            );
        }
        case "add_line": {
            const newElements = [...state];
            const elementIndex = mustFindIndex(
                newElements,
                (element) => element.id == action.payload.chartId
            );

            newElements[elementIndex] = {
                ...newElements[elementIndex],
            };

            newElements[elementIndex].lines = [
                ...newElements[elementIndex].lines,
            ];

            if (
                newElements[elementIndex].lines.findIndex(
                    (description) => description.id == action.payload.line.id
                ) == -1
            ) {
                newElements[elementIndex].lines.push(action.payload.line);
            }

            return newElements;
        }
        case "remove_line": {
            const newElements = [...state];

            const elementIndex = mustFindIndex(
                newElements,
                (element) => element.id == action.payload.chartId
            );

            newElements[elementIndex] = { ...newElements[elementIndex] };

            newElements[elementIndex].lines = newElements[
                elementIndex
            ].lines.filter((line) => line.id != action.payload.lineId);

            if (newElements[elementIndex].lines.length == 0) {
                newElements.splice(elementIndex, 1);
            }

            return newElements;
        }
    }
}

export function useCharts() {
    const [charts, dispatch] = useReducer(reducer, []);
    return {
        charts,
        addChart: (id: string, line: ChartLine) =>
            dispatch({ type: "add_element", payload: { id, line } }),
        removeChart: (id: string) =>
            dispatch({ type: "remove_element", payload: id }),
        addLine: (chartId: string, line: ChartLine) =>
            dispatch({
                type: "add_line",
                payload: { chartId: chartId, line: line },
            }),
        removeLine: (chartId: string, lineId: string) =>
            dispatch({
                type: "remove_line",
                payload: {
                    chartId: chartId,
                    lineId: lineId,
                },
            }),
    };
}

import { useReducer } from "react";
import { ChartType, ChartLine } from "./ChartTypes";
// @ts-ignore
import CanvasJS from "@canvasjs/charts";
import { Chart } from "canvasjs";

type AddElement = {
    type: "add_element";
    payload: { id: string, line: ChartLine };
};

type SetCanvas = {
    type: "set_canvas";
    payload: { id: string; canvas: Chart }
}

type RemoveElement = {
    type: "remove_element";
    payload: string;
};

type ChartActions = AddElement | RemoveElement | SetCanvas;

function reducer(state: ChartType[], action: ChartActions): ChartType[] {

    switch (action.type) {
        case "add_element":
            const chartIndex = state.findIndex(chart => chart.id == action.payload.id)
            if (chartIndex !== -1) {
                return [...state]
            }

            const line = action.payload.line
            const chartId = action.payload.id
            return [
                ...state,
                {
                    id: chartId,
                    line: line,
                    canvas: undefined
                }
            ];

        case "remove_element": {
            const chartId = action.payload
            return state.filter( (chartElement) => chartElement.id != chartId );
        }

        case "set_canvas": {
            const chartIndex = state.findIndex(chartElement => chartElement.id == action.payload.id)
            if(chartIndex !== -1) {
                const chart = state[chartIndex];
                if(chart.canvas === undefined) {
                    chart.canvas = action.payload.canvas;
                    state[chartIndex] = chart;
                }
            }
            return [...state];
        }

        // case "add_line": {
            // const newElements = [...state];
            // // TODO: Change to JS Find function.
            // const elementIndex = mustFindIndex(
            //     newElements,
            //     (element) => element.id == action.payload.chartId
            // );

            // newElements[elementIndex] = {
            //     ...newElements[elementIndex],
            // };

            // newElements[elementIndex].lines = [
            //     ...newElements[elementIndex].lines,
            // ];

            // if (
            //     newElements[elementIndex].lines.findIndex(
            //         (description) => description.id == action.payload.line.id
            //     ) == -1
            // ) {
            //     newElements[elementIndex].lines.push(action.payload.line);
            // }

            // return newElements;
        // }
        // case "remove_line": {
            // const newElements = [...state];

            // const elementIndex = mustFindIndex(
            //     newElements,
            //     (element) => element.id == action.payload.chartId
            // );

            // newElements[elementIndex] = { ...newElements[elementIndex] };

            // newElements[elementIndex].lines = newElements[
            //     elementIndex
            // ].lines.filter((line) => line.id != action.payload.lineId);

            // if (newElements[elementIndex].lines.length == 0) {
            //     newElements.splice(elementIndex, 1);
            // }

            // return newElements;
       default: {
            return [] as ChartType[]
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
        setCanvas: (id: string, canvas: Chart) => 
            dispatch({ type: "set_canvas", payload: {id, canvas} })
    };
}

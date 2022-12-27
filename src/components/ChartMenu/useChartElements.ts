import { useState, useRef } from "react";
import { ChartElement, LineFigure } from "@components/ChartMenu/ChartElement";
import { HSLAColor } from "@utils/color";

function getColor(offset: number): HSLAColor {
    return {
        h: (32 + offset * 50) % 360,
        s: 90,
        l: 75,
        a: 1,
    };
}

export function useChartElements(): [
    ChartElement[],
    (measurementName: string) => void,
    (id: number, measurementName: string) => void,
    (updatedMeasurements: Map<string, number>) => void,
    (id: number) => void,
    (chartId: number, lineItemId: string) => void
] {
    const [chartElements, setChartElements] = useState([] as ChartElement[]);
    const chartIndex = useRef(0);

    function addElement(measurementName: string): void {
        const newElement = {
            id: chartIndex.current,
            lines: new Map([
                [measurementName, new LineFigure(measurementName, getColor(0))],
            ]),
        };

        setChartElements((prevElements) => {
            return [...prevElements, newElement];
        });
        chartIndex.current++;
    }

    function addLineToElement(id: number, measurementName: string): void {
        if (isAlreadyInChart(id, measurementName)) {
            return;
        } else {
            setChartElements((prevElements) => {
                const index = prevElements.findIndex(
                    (element) => element.id == id
                );
                const newElement = { ...prevElements[index] };

                newElement.lines = new Map(
                    newElement.lines.set(
                        measurementName,
                        new LineFigure(
                            measurementName,
                            getColor(newElement.lines.size + 1)
                        )
                    )
                );

                return replaceElement(prevElements, newElement, index);
            });
        }
    }

    function isAlreadyInChart(id: number, measurementName: string): boolean {
        let index = chartElements.findIndex((element) => element.id == id)!;
        return chartElements[index].lines.has(measurementName);
    }

    function replaceElement<T>(
        elementArr: T[],
        element: T,
        index: number
    ): T[] {
        return Object.assign([], elementArr, { index: element });
    }

    function updateElements(updatedMeasurements: Map<string, number>): void {
        setChartElements((prevElements) => {
            return prevElements.map((element) => {
                for (let [name, value] of updatedMeasurements) {
                    if (element.lines.has(name)) {
                        let line = element.lines.get(name)!;
                        line.updateVector(value);
                        element.lines.set(name, line);
                        let newLines = new Map(element.lines);
                        element.lines = newLines;
                    }
                }
                return element;
            });
        });
    }

    function removeElement(id: number): void {
        setChartElements((prevElements) => {
            return prevElements.filter((element) => {
                return element.id != id;
            });
        });
    }

    function removeLineItem(chartId: number, lineItemId: string) {
        setChartElements((prevElements) => {
            let elementIndex = prevElements.findIndex(
                (element) => element.id == chartId
            );
            let newChartElement = prevElements[elementIndex];

            newChartElement.lines.delete(lineItemId);
            if (newChartElement.lines.size == 0) {
                return [...prevElements].filter(
                    (element) => element.id != chartId
                );
            } else {
                return replaceElement(
                    prevElements,
                    newChartElement,
                    elementIndex
                );
            }
        });
    }

    return [
        chartElements,
        addElement,
        addLineToElement,
        updateElements,
        removeElement,
        removeLineItem,
    ];
}

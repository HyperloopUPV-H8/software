import { nanoid } from "nanoid";
import { useState } from "react";
import { ChartElement } from "./ChartElement";
import { mustFindIndex } from "utils/array";

const INITIAL_COLOR = "hsl(21, 84%, 57%)";
let colorOffset = -1;

function getNextColor(): string {
    const matches = INITIAL_COLOR.replaceAll(" ", "").match(
        /hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)/
    )!;
    const h = matches[1];
    const s = matches[2];
    const l = matches[3];
    colorOffset++;
    return `hsl(${(parseInt(h) + 20 * colorOffset) % 360},${s}%,${l}%)`;
}

function createChartElement(measurementId: string): ChartElement {
    return {
        id: nanoid(),
        lineDescriptions: [{ id: measurementId, color: getNextColor() }],
    };
}

export function useChartElements() {
    const [chartElements, setChartElements] = useState<ChartElement[]>([]);

    function addElement(measurementId: string): void {
        setChartElements((prevElements) => {
            return [...prevElements, createChartElement(measurementId)];
        });
    }

    function addMeasurementToElement(
        elementId: string,
        measurementId: string
    ): void {
        setChartElements((prevElements) => {
            const newElements = [...prevElements];

            const elementIndex = mustFindIndex(
                newElements,
                (element) => element.id == elementId
            );

            newElements[elementIndex] = {
                ...newElements[elementIndex],
            };

            newElements[elementIndex].lineDescriptions = [
                ...newElements[elementIndex].lineDescriptions,
            ];

            if (
                newElements[elementIndex].lineDescriptions.findIndex(
                    (description) => description.id == measurementId
                ) == -1
            ) {
                newElements[elementIndex].lineDescriptions.push({
                    id: measurementId,
                    color: getNextColor(),
                });
            }

            return newElements;
        });
    }

    function removeElement(elementId: string) {
        setChartElements((prevElements) => {
            const newElements = [...prevElements];

            return newElements.filter((element) => element.id != elementId);
        });
    }

    function removeMeasurementFromElement(
        elementId: string,
        measurementId: string
    ): void {
        setChartElements((prevElements) => {
            const newElements = [...prevElements];

            const elementIndex = mustFindIndex(
                newElements,
                (element) => element.id == elementId
            );

            newElements[elementIndex] = { ...newElements[elementIndex] };

            newElements[elementIndex].lineDescriptions = newElements[
                elementIndex
            ].lineDescriptions.filter((line) => line.id != measurementId);

            if (newElements[elementIndex].lineDescriptions.length == 0) {
                newElements.splice(elementIndex, 1);
            }

            return newElements;
        });
    }

    return {
        chartElements,
        addElement,
        addMeasurementToElement,
        removeMeasurementFromElement,
        removeElement,
    } as const;
}

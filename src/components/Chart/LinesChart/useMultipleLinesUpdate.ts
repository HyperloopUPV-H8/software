import { useInterval } from "hooks/useInterval";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { dataToPath } from "./path";
import { LineDataHandler } from "./LineDataHandler";
import { LineDescription, LineInstance } from "./line";
import { store } from "store";
import { NumericMeasurement } from "common";

function getInitialCollectiveRange(measurementsId: Array<string>): {
    min: number;
    max: number;
} {
    const ranges = measurementsId.map((id) => {
        return (store.getState().measurements[id] as NumericMeasurement)
            .warningRange;
    });

    return getLargestRange(ranges);
}

export function useMultipleLinesUpdate(
    viewBoxWidth: number,
    viewBoxHeight: number,
    maxLineLength: number,
    lineDescriptions: Array<LineDescription>
) {
    const ref = useRef<SVGSVGElement>(null);
    const initialCollectiveRange = useMemo(
        () =>
            getInitialCollectiveRange(lineDescriptions.map((line) => line.id)),
        []
    );

    const [collectiveRange, setCollectiveRange] = useState<{
        min: number;
        max: number;
    }>(initialCollectiveRange);

    const lineInstancesRef = useRef<Array<LineInstance>>([]);

    useInterval(() => {
        const { min, max } = getLargestRange(
            lineInstancesRef.current.map((line) => line.range)
        );

        if (min != collectiveRange.min || max != collectiveRange.max) {
            setCollectiveRange({ min, max });
        }

        lineInstancesRef.current.forEach((line) => {
            line.lineHandler.updateData(line.getUpdate());
            const updatedData = line.lineHandler.getData();
            const path = dataToPath(
                updatedData,
                maxLineLength,
                min,
                max,
                viewBoxWidth,
                viewBoxHeight
            );

            line.ref.setAttribute("d", path);
        });
    }, 1000 / 40);

    useLayoutEffect(() => {
        const newLineInstances = createLineInstances(
            lineDescriptions,
            lineInstancesRef.current,
            maxLineLength
        );
        appendPaths(ref.current!, newLineInstances);

        lineInstancesRef.current = newLineInstances;

        return () => {
            ref.current?.replaceChildren();
        };
    }, [lineDescriptions]);

    useLayoutEffect(() => {
        return () => {
            ref.current?.replaceChildren();
        };
    }, []);

    return { ref, min: collectiveRange.min, max: collectiveRange.max };
}

function appendPaths(
    svgElement: SVGSVGElement,
    lineInstances: Array<LineInstance>
): void {
    lineInstances.forEach((line) => {
        svgElement.appendChild(line.ref);
    });
}

function createLineInstances(
    linesDescriptions: Array<LineDescription>,
    lineInstances: Array<LineInstance>,
    maxLineLength: number
): Array<LineInstance> {
    return linesDescriptions.map((description) => {
        return {
            id: description.id,
            ref: createPathElement(description.color),
            range: (
                store.getState().measurements[
                    description.id
                ] as NumericMeasurement
            ).warningRange,
            getUpdate: () =>
                (
                    store.getState().measurements[
                        description.id
                    ] as NumericMeasurement
                ).value.last,
            lineHandler:
                lineInstances.find((line) => description.id == line.id)
                    ?.lineHandler ?? new LineDataHandler([], maxLineLength),
        };
    });
}

function createPathElement(color: string): SVGPathElement {
    const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    pathElement.setAttribute("vector-effect", "non-scaling-stroke");
    pathElement.setAttribute("stroke", color);
    pathElement.setAttribute("stroke-width", "3");
    pathElement.setAttribute("stroke-linejoin", "round");

    return pathElement;
}

function getLargestRange(ranges: Array<[number, number]>): {
    min: number;
    max: number;
} {
    //FIXME: si el rango es -Infinity, Infinity no va a funcionar, pero puede que suceda
    let min: number = Infinity;
    let max: number = -Infinity;

    for (const range of ranges) {
        min = range[0] < min ? range[0] : min;
        max = range[1] > max ? range[1] : max;
    }

    return { min, max };
}

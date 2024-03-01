import { useState, useEffect, useMemo } from "react";
import { SeparatorEventHandler } from "./SeparatorEventHandler";
import { Orientation } from "./Orientation";
import { InitialState as InitialState } from "./InitialState";

export type Size = {
    width: number;
    height: number;
};

export type SplitElement = {
    length: number;
    minLength: number;
};

export function useSplit(minLengths: number[], direction: Orientation) {
    const [elements, setElements] = useState<SplitElement[]>(
        minLengths.map((minLength) => ({
            length: 1 / minLengths.length,
            minLength: minLength,
        }))
    );

    const separatorEventHandler = useMemo(
        () => new SeparatorEventHandler(),
        []
    );

    useEffect(() => {
        separatorEventHandler.onMouseDown = (ev, sepIndex) => {
            const separator = ev.currentTarget as HTMLElement;
            const wrapper = separator.parentElement!;

            const initialState = new InitialState(
                [ev.clientX, ev.clientY],
                [...elements],
                direction,
                sepIndex,
                getSize(separator),
                getSize(wrapper)
            );

            separatorEventHandler.onMove = (clientX, clientY) => {
                const normDistace = getNormDistance(
                    clientX,
                    clientY,
                    direction,
                    initialState
                );

                setElements(() => {
                    const newElements = getResizedElements(
                        initialState.initialElements,
                        normDistace,
                        initialState.separatorIndex
                    );

                    return newElements;
                });
            };
        };

        separatorEventHandler.onMouseUp = () => {
            separatorEventHandler.onMove = () => {};
        };
    }, [elements]);

    return [elements, separatorEventHandler.handleMouseDown] as const;
}

function getResizedElements(
    elements: SplitElement[],
    normDistance: number,
    sepIndex: number
) {
    const direction = Math.sign(normDistance) as 1 | 0 | -1;

    const { affected, affectedIndex, unaffected, unaffectedIndex } =
        getAffectedAndUnaffectedElements(elements, direction, sepIndex);

    const shrinkedElements = substractDisplacement(affected, normDistance);

    const mainElementIndex = direction == 1 ? sepIndex : sepIndex + 1;

    const newMainElement = getNewMainElement(elements[mainElementIndex], [
        ...shrinkedElements,
        ...unaffected,
    ]);

    return getFinalElements(
        newMainElement,
        mainElementIndex,
        shrinkedElements,
        affectedIndex,
        unaffected,
        unaffectedIndex,
        direction
    );
}

function getFinalElements(
    newMainElement: SplitElement,
    newMainElementIndex: number,
    shrinkedElements: SplitElement[],
    shrinkedElementsIndex: number,
    unaffectedElements: SplitElement[],
    unaffectedElementsIndex: number,
    direction: 1 | 0 | -1
) {
    return direction == 1 || direction == 0
        ? Object.assign(
              [] as SplitElement[],
              {
                  [unaffectedElementsIndex]: unaffectedElements,
              },
              {
                  [newMainElementIndex]: newMainElement,
              },
              {
                  [shrinkedElementsIndex]: shrinkedElements,
              }
          ).flat()
        : Object.assign(
              [] as SplitElement[],
              {
                  [shrinkedElementsIndex]: shrinkedElements,
              },
              {
                  [newMainElementIndex]: newMainElement,
              },

              {
                  [unaffectedElementsIndex]: unaffectedElements,
              }
          ).flat();
}

function getAffectedAndUnaffectedElements(
    elements: SplitElement[],
    direction: 1 | 0 | -1,
    separatorIndex: number
): {
    affected: SplitElement[];
    affectedIndex: number;
    unaffected: SplitElement[];
    unaffectedIndex: number;
} {
    if (direction == 1) {
        return {
            affected: elements.slice(separatorIndex + 1),
            affectedIndex: separatorIndex + 1,
            unaffected: elements.slice(0, separatorIndex),
            unaffectedIndex: 0,
        };
    } else if (direction == -1) {
        return {
            affected: elements.slice(0, separatorIndex + 1),
            affectedIndex: 0,
            unaffected: elements.slice(separatorIndex + 2),
            unaffectedIndex: separatorIndex + 2,
        };
    } else {
        return {
            affected: [],
            affectedIndex: 1,
            unaffected: elements,
            unaffectedIndex: 0,
        };
    }
}

function getNewMainElement(
    mainElement: SplitElement,
    elements: SplitElement[]
): SplitElement {
    const mainElementLength =
        1 -
        elements.reduce((prevValue, currentElement) => {
            return prevValue + currentElement.length;
        }, 0);

    return {
        length: mainElementLength,
        minLength: mainElement.minLength,
    };
}

function substractDisplacement(
    elements: SplitElement[],
    distance: number
): SplitElement[] {
    const orderedElements =
        distance >= 0 ? [...elements] : [...elements].reverse();

    let remaindingDistance = Math.abs(distance);

    for (let i = 0; i < orderedElements.length; i++) {
        let newLength = orderedElements[i].length - remaindingDistance;
        if(newLength < orderedElements[i].minLength) newLength = 0;
        remaindingDistance = Math.max(
            remaindingDistance - (orderedElements[i].length - newLength),
            0
        );

        orderedElements[i] = {
            length: newLength,
            minLength: orderedElements[i].minLength,
        };

        if (remaindingDistance < 0.00001) break;
    }

    return distance > 0 ? orderedElements : orderedElements.reverse();
}

function getNormDistance(
    x: number,
    y: number,
    direction: Orientation,
    state: InitialState
) {
    const distance =
        direction == Orientation.HORIZONTAL
            ? x - state.initialMousePos[0]
            : y - state.initialMousePos[1];

    const wrapperLength = getLength(state.wrapperSize, state.direction);

    const wrapperLengthWithoutSeparators =
        wrapperLength -
        getLength(state.separatorSize, state.direction) *
            (state.initialElements.length - 1);

    return distance / wrapperLengthWithoutSeparators;
}

function getLength(size: Size, direction: Orientation): number {
    if (direction == Orientation.HORIZONTAL) {
        return size.width;
    } else {
        return size.height;
    }
}

function getSize(element: HTMLElement): Size {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

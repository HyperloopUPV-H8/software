import { useState, useEffect, useRef } from "react";

import { SplitLayoutEventHandler } from "@layouts/SplitLayout/SplitLayoutEventHandler";
import { Direction } from "@layouts/SplitLayout/Direction";

type Size = {
    width: number;
    height: number;
};

type SplitElement = {
    length: number;
    minLength: number;
};

function getElementSize(element: HTMLElement): Size {
    let rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

class InitialSplitState {
    public initialMousePos: [number, number];
    public initialElements: SplitElement[];
    public separatorIndex: number;
    public separatorSize: Size;
    public wrapperSize: Size;

    constructor() {
        this.initialMousePos = [0, 0];
        this.initialElements = [];
        this.separatorIndex = 0;
        this.separatorSize = { width: 0, height: 0 };
        this.wrapperSize = { width: 0, height: 0 };
    }

    public updateMousePos(ev: React.MouseEvent): void {
        this.initialMousePos = [ev.clientX, ev.clientY];
    }

    public updateSeparatorAndWrapperSizes(ev: React.MouseEvent): void {
        const [separatorElement, wrapperElement] =
            this.getSeparatorAndWrapper(ev);
        this.separatorSize = getElementSize(separatorElement);
        this.wrapperSize = getElementSize(wrapperElement);
    }

    private getSeparatorAndWrapper(
        ev: React.MouseEvent
    ): [HTMLElement, HTMLElement] {
        const separatorElement = ev.currentTarget as HTMLElement;
        const wrapperElement = separatorElement.parentElement!;
        return [separatorElement, wrapperElement];
    }

    public updateInitialElements(elements: SplitElement[]) {
        this.initialElements = [...elements];
    }
}

export function useSplitLayoutHandler(
    numberOfComponents: number, //FIXME: TIENE QUE SER DOS O MAS (mirar getNewPortions)
    minLengths: number[],
    direction: Direction
): [SplitElement[], (index: number, ev: React.MouseEvent) => void] {
    const [splitElements, setSplitElements] = useState<SplitElement[]>(
        minLengths.map((minLength) => ({
            length: 1 / numberOfComponents,
            minLength: minLength,
        }))
    );

    const initialSplitStateRef = useRef(new InitialSplitState());
    const splitLayoutEventHandler = useRef(new SplitLayoutEventHandler());

    useEffect(() => {
        splitLayoutEventHandler.current.onSeparatorMove = (
            clientX,
            clientY
        ) => {
            setSplitElements(() => {
                const normalizedDisplacement = getNormalizedDisplacement(
                    clientX,
                    clientY
                );
                const newElements = getResizedElements(normalizedDisplacement);
                return [...newElements];
            });
        };
    }, []);

    useEffect(() => {
        splitLayoutEventHandler.current.onSeparatorMouseDown = (
            separatorIndex,
            ev
        ) => {
            const initialSplitState = initialSplitStateRef.current;
            initialSplitState.updateMousePos(ev);
            initialSplitState.separatorIndex = separatorIndex;
            initialSplitState.updateSeparatorAndWrapperSizes(ev);
            initialSplitState.updateInitialElements(splitElements);
        };
    }, [splitElements]);

    function getLength(size: Size): number {
        if (direction == Direction.HORIZONTAL) {
            return size.width;
        } else {
            return size.height;
        }
    }

    function getResizedElements(normalizedDisplacement: number) {
        const separatorIndex = initialSplitStateRef.current.separatorIndex;
        const displacementDirection = Math.sign(normalizedDisplacement) as
            | 1
            | -1;
        const [
            affectedElements,
            affectedElementsIndex,
            unaffectedElements,
            unaffectedElementsIndex,
        ] = getAffectedAndUnaffectedElements(
            displacementDirection,
            separatorIndex
        );

        const shrinkedElements = substractDisplacement(
            affectedElements,
            normalizedDisplacement
        );

        const [newMainElement, newMainElementIndex] = getNewMainElement(
            [shrinkedElements, unaffectedElements].flat(),
            displacementDirection,
            separatorIndex
        );

        return getFinalElements(
            newMainElement,
            newMainElementIndex,
            affectedElements,
            affectedElementsIndex,
            unaffectedElements,
            unaffectedElementsIndex,
            displacementDirection
        );
    }

    function getFinalElements(
        newMainElement: SplitElement,
        newMainElementIndex: number,
        affectedElements: SplitElement[],
        affectedElementsIndex: number,
        unaffectedElements: SplitElement[],
        unaffectedElementsIndex: number,
        displacementDirection: number
    ) {
        return displacementDirection > 0
            ? Object.assign(
                  [],
                  {
                      [unaffectedElementsIndex]: unaffectedElements,
                  },
                  {
                      [newMainElementIndex]: newMainElement,
                  },
                  {
                      [affectedElementsIndex]: affectedElements,
                  }
              ).flat()
            : Object.assign(
                  [],
                  {
                      [affectedElementsIndex]: affectedElements,
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
        displacementDirection: 1 | -1,
        separatorIndex: number
    ): [SplitElement[], number, SplitElement[], number] {
        const initialElements = initialSplitStateRef.current.initialElements;
        let [
            affectedElements,
            affectedElementsIndex,
            unaffectedElements,
            unaffectedElementsIndex,
        ] =
            displacementDirection == 1
                ? [
                      initialElements.slice(separatorIndex + 1),
                      separatorIndex + 1,
                      initialElements.slice(0, separatorIndex),
                      0,
                  ]
                : [
                      initialElements.slice(0, separatorIndex + 1),
                      0,
                      initialElements.slice(separatorIndex + 2),
                      separatorIndex + 2,
                  ];

        return [
            copyElements(affectedElements),
            affectedElementsIndex,
            copyElements(unaffectedElements),
            unaffectedElementsIndex,
        ];
    }

    function getNewMainElement(
        restOfElements: SplitElement[],
        displacementDirection: 1 | -1,
        separatorIndex: number
    ): [SplitElement, number] {
        const initialElements = initialSplitStateRef.current.initialElements;

        const mainElementLength =
            1 -
            restOfElements.reduce((prevValue, currentElement) => {
                return prevValue + currentElement.length;
            }, 0);

        const mainElementIndex =
            displacementDirection == 1 ? separatorIndex : separatorIndex + 1;

        return [
            {
                length: mainElementLength,
                minLength: initialElements[mainElementIndex].minLength,
            },
            mainElementIndex,
        ];
    }

    function substractDisplacement(
        elements: SplitElement[],
        displacement: number
    ): SplitElement[] {
        let orderedElements =
            displacement > 0 ? [...elements] : [...elements].reverse();
        let remaindingDisplacement = Math.abs(displacement);
        for (let i = 0; i < orderedElements.length; i++) {
            const newLength = Math.max(
                orderedElements[i].length - remaindingDisplacement,
                orderedElements[i].minLength
            );
            remaindingDisplacement = Math.max(
                remaindingDisplacement -
                    (orderedElements[i].length - newLength),
                0
            );

            orderedElements[i].length = newLength;
            if (remaindingDisplacement < 0.00001) break;
        }

        return displacement > 0 ? orderedElements : orderedElements.reverse();
    }

    function copyElements(elements: SplitElement[]): SplitElement[] {
        return elements.map((element) => ({
            length: element.length,
            minLength: element.minLength,
        }));
    }

    function getMouseDisplacement(clientX: number, clientY: number): number {
        if (direction == Direction.HORIZONTAL) {
            return clientX - initialSplitStateRef.current.initialMousePos[0];
        } else {
            return clientY - initialSplitStateRef.current.initialMousePos[1];
        }
    }

    function getNormalizedDisplacement(
        clientX: number,
        clientY: number
    ): number {
        let initialSplitState = initialSplitStateRef.current;
        const screenDisplacement = getMouseDisplacement(clientX, clientY);
        const wrapperLength = getLength(initialSplitState.wrapperSize);
        const wrapperLengthWithoutSeparators =
            wrapperLength -
            getLength(initialSplitState.separatorSize) *
                (numberOfComponents - 1);
        return screenDisplacement / wrapperLengthWithoutSeparators;
    }

    return [
        splitElements,
        splitLayoutEventHandler.current.handleSeperatorMouseDown,
    ];
}

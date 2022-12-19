import {
    useState,
    useEffect,
    useRef,
    MouseEvent as ReactMouseEvent,
} from "react";

import { SplitLayoutEventHandler } from "@layouts/SplitLayout/SplitLayoutEventHandler";
import { iterateFrom, iterateFromReverse } from "@utils/array";
import { Direction } from "@layouts/SplitLayout/Direction";

type Size = {
    width: number;
    height: number;
};

function getElementSize(element: HTMLElement): Size {
    let rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

class InitialSplitState {
    public initialMousePos: [number, number];
    public initialPortions: number[];
    public separatorIndex: number;
    public separatorSize: Size;
    public wrapperSize: Size;

    constructor() {
        this.initialMousePos = [0, 0];
        this.initialPortions = [];
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

    public updateInitialPortions(portions: number[]) {
        this.initialPortions = [...portions];
    }
}

export function useSplitLayoutHandler(
    numberOfComponents: number, //FIXME: TIENE QUE SER DOS O MAS (mirar getNewPortions)
    minSizes: number[],
    direction: Direction
): [number[], (index: number, ev: React.MouseEvent) => void] {
    const [normalizedPortions, setNormalizedPortions] = useState(
        new Array(numberOfComponents).fill(1 / numberOfComponents)
    );

    const initialSplitStateRef = useRef(new InitialSplitState());
    const splitLayoutEventHandler = useRef(new SplitLayoutEventHandler());

    useEffect(() => {
        splitLayoutEventHandler.current.onSeparatorMove = (
            clientX,
            clientY
        ) => {
            setNormalizedPortions((prevPortions) => {
                const normalizedDisplacement = getNormalizedDisplacement(
                    clientX,
                    clientY
                );

                const newPortions = getNewPortions(
                    prevPortions,
                    normalizedDisplacement
                );
                return [...newPortions];
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
            initialSplitState.updateInitialPortions(normalizedPortions);
        };
    }, [normalizedPortions]);

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

    function getLength(size: Size): number {
        if (direction == Direction.HORIZONTAL) {
            return size.width;
        } else {
            return size.height;
        }
    }

    function getNewPortions(
        prevPortions: number[],
        normalizedDisplacement: number
    ) {
        const newPortions = getPortionsWithDisplacement(
            normalizedDisplacement,
            prevPortions
        );
        if (
            newPortions.reduce(
                (prevPortion, currentPortion) => prevPortion + currentPortion,
                0
            ) <= 1
        ) {
            return newPortions;
        } else {
            return [...prevPortions];
        }
    }

    function getPortionsWithDisplacement(
        normalizedDisplacement: number,
        prevPortions: number[]
    ) {
        const initialPortions = initialSplitStateRef.current.initialPortions;
        const separatorIndex = initialSplitStateRef.current.separatorIndex;
        let remaindingDisplacement = Math.abs(normalizedDisplacement);

        const newPortions = [...prevPortions];
        if (normalizedDisplacement > 0) {
            newPortions[separatorIndex] =
                initialPortions[separatorIndex] +
                Math.abs(normalizedDisplacement);
            distributeDisplacementForward(
                initialPortions,
                remaindingDisplacement,
                newPortions,
                separatorIndex
            );
        } else {
            newPortions[separatorIndex + 1] =
                initialPortions[separatorIndex + 1] +
                Math.abs(normalizedDisplacement);
            distributeDisplacementBackwards(
                initialPortions,
                remaindingDisplacement,
                newPortions,
                separatorIndex
            );
        }

        return newPortions;
    }

    function distributeDisplacementForward(
        initialPortions: number[],
        remaindingDisplacement: number,
        newPortions: number[],
        separatorIndex: number
    ) {
        iterateFrom(
            initialPortions,
            (portion, index) => {
                if (remaindingDisplacement != 0) {
                    [newPortions[index], remaindingDisplacement] = clampPortion(
                        portion,
                        minSizes[index],
                        remaindingDisplacement
                    );
                }
            },
            separatorIndex + 1
        );
    }

    function distributeDisplacementBackwards(
        initialPortions: number[],
        remaindingDisplacement: number,
        newPortions: number[],
        separatorIndex: number
    ) {
        iterateFromReverse(
            initialPortions,
            (portion, index) => {
                if (remaindingDisplacement != 0) {
                    [newPortions[index], remaindingDisplacement] = clampPortion(
                        portion,
                        minSizes[index],
                        remaindingDisplacement
                    );
                }
            },
            separatorIndex
        );
    }

    function clampPortion(
        portion: number,
        minPortion: number,
        displacement: number
    ): [number, number] {
        const newPortion = Math.max(portion - displacement, minPortion);
        const remaindingDisplacement = Math.max(
            displacement - (portion - newPortion),
            0
        );
        return [newPortion, remaindingDisplacement];
    }

    return [
        normalizedPortions,
        splitLayoutEventHandler.current.handleSeperatorMouseDown,
    ];
}

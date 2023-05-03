import { useContext } from "react";

import { FigureContext } from "../Figure/Figure";
type Props = {
    value: number;
    strokeWidth: number;
    strokeColor: string;
    strokeDasharray: string;
};

function normalizeY(
    value: number,
    minY: number,
    maxY: number,
    height: number
): number {
    let normalizedY = height - ((value - minY) * height) / (maxY - minY);

    if (isNaN(normalizedY)) {
        normalizedY = height / 2;
    }

    return normalizedY;
}

export const HLine = ({
    value,
    strokeWidth,
    strokeColor,
    strokeDasharray,
}: Props) => {
    const { height, maxY, minY, width } = useContext(FigureContext)!;
    const yCoord = normalizeY(value, minY, maxY, height);

    return (
        <path
            vectorEffect={"non-scaling-stroke"}
            d={`M 0 ${yCoord} L ${width} ${yCoord}`}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeDasharray={strokeDasharray}
        ></path>
    );
};

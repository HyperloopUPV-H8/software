import { getPath } from "components/Charts/figures";
import { FigureContext } from "../Figure/Figure";
import { useContext } from "react";
type Props = {
    data: number[];
    strokeWidth: number;
    strokeColor: string;
    fillColor: string;
};

export const Line = ({ data, strokeWidth, strokeColor, fillColor }: Props) => {
    const { height, maxY, minY, width } = useContext(FigureContext)!;
    const maxX = data.length > 0 ? data.length - 1 : 0;
    const path = getPath(data, 0, maxX, minY, maxY, width, height);

    return (
        <>
            <path
                vectorEffect={"non-scaling-stroke"}
                d={
                    path == ""
                        ? ""
                        : `${path} L ${width} ${height} L 0 ${height}`
                }
                stroke={"none"}
                fill={fillColor}
                strokeLinejoin="round"
            ></path>
            <path
                vectorEffect={"non-scaling-stroke"}
                d={path}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
            ></path>
        </>
    );
};

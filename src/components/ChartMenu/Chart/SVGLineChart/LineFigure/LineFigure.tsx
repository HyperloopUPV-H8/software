import { LineFigure as LineFigureElement } from "components/ChartMenu/ChartElement";
import { getVectorLimits } from "utils/math";
import { getSofterHSLAColor, hslaToHex, hslaToString } from "utils/color";

function normalize(
    number: number,
    min: number,
    max: number,
    totalWidth: number
): number {
    if (max != min) {
        return ((number - min) / (max - min)) * totalWidth;
    } else {
        return totalWidth / 2;
    }
}

function getSVGPath(
    line: number[],
    viewBoxWidth: number,
    min: number,
    max: number
): string {
    if (line.length >= 2 && max != -Infinity && min != Infinity) {
        const startingPoint = `M 0 ${
            viewBoxWidth - normalize(line[0], min, max, viewBoxWidth)
        }`;
        let linePath = "";
        for (let index = 1; index < line.length; index++) {
            linePath += `L ${normalize(index, 0, line.length, viewBoxWidth)} ${
                viewBoxWidth - normalize(line[index], min, max, viewBoxWidth)
            }`;

            linePath += " ";
        }
        return startingPoint + " " + linePath;
    } else {
        return "M 0 0";
    }
}

type Props = {
    lineFigure: LineFigureElement;
    min: number;
    max: number;
    viewBoxWidth: number;
    viewBoxHeight: number;
};

export const LineFigure = ({
    lineFigure,
    min,
    max,
    viewBoxWidth,
    viewBoxHeight,
}: Props) => {
    const colorString = hslaToString(lineFigure.color);
    const svgPath = getSVGPath(lineFigure.vector, viewBoxWidth, min, max);
    return (
        <>
            <path
                vectorEffect={"non-scaling-stroke"}
                d={svgPath}
                stroke={colorString}
            ></path>
            <path
                vectorEffect={"non-scaling-stroke"}
                d={
                    svgPath +
                    `L ${viewBoxWidth} ${viewBoxHeight} L 0 ${viewBoxHeight}`
                }
                stroke={"none"}
                fill={hslaToString(
                    getSofterHSLAColor({ ...lineFigure.color, a: 0.3 }, 18)
                )}
            ></path>
        </>
    );
};

import { useMemo } from "react";

type Props = {
    viewBoxWidth: number;
    viewBoxHeight: number;
    verticalDivisions: number;
    horizontalDivisions: number;
};

const STROKE_WIDTH = 0.5;
const STROKE_OPACITY = 0.2;

export const Grid = ({
    viewBoxWidth,
    viewBoxHeight,
    verticalDivisions,
    horizontalDivisions,
}: Props) => {
    if (verticalDivisions < 1 || horizontalDivisions < 1) {
        console.error("grid divisions should be greater or equal to 1");
    }

    const widths = useMemo(() => {
        return getDivisionsPositions(viewBoxWidth, horizontalDivisions);
    }, [viewBoxWidth, horizontalDivisions]);

    const heights = useMemo(() => {
        return getDivisionsPositions(viewBoxHeight, verticalDivisions);
    }, [viewBoxHeight, verticalDivisions]);

    return (
        <g>
            {/* Horizontal divisions */}
            {heights.map((height, index) => {
                return (
                    <line
                        shapeRendering={"crispEdges"}
                        vectorEffect={"non-scaling-stroke"}
                        key={index}
                        x1={0}
                        y1={height}
                        x2={viewBoxWidth}
                        y2={height}
                        stroke="black"
                        strokeOpacity={STROKE_OPACITY}
                        strokeWidth={STROKE_WIDTH}
                    ></line>
                );
            })}

            {/* Vertical divisions */}
            {widths.map((width, index) => {
                return (
                    <line
                        shapeRendering={"crispEdges"}
                        vectorEffect={"non-scaling-stroke"}
                        key={index}
                        x1={width}
                        y1={0}
                        x2={width}
                        y2={viewBoxHeight}
                        stroke="black"
                        strokeOpacity={STROKE_OPACITY}
                        strokeWidth={STROKE_WIDTH}
                    ></line>
                );
            })}
        </g>
    );
};

function getDivisionsPositions(
    totalLength: number,
    divisions: number
): number[] {
    const positions: number[] = [];
    for (let i = 0; i < divisions + 1; i++) {
        positions.push((i * totalLength) / divisions);
    }

    return positions;
}

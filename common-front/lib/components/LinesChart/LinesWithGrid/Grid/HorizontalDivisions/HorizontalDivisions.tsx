import { useMemo } from "react";
import { getDivisions } from "../getDivisions";

type Props = {
    divisions: number;
    height: number;
    strokeOpacity: number;
    strokeWidth: number;
};

export const HorizontalDivisions = ({
    height,
    divisions,
    strokeOpacity,
    strokeWidth,
}: Props) => {
    if (divisions == 0) {
        return null;
    }

    const heights = useMemo(() => {
        return getDivisions(height, divisions);
    }, [height, divisions]);

    // TODO: can it be return height.map(...) without the wrapping React.Fragment
    return (
        <>
            {heights.map((height, index) => {
                return (
                    <line
                        shapeRendering={"crispEdges"}
                        vectorEffect={"non-scaling-stroke"}
                        key={index}
                        x1={0}
                        y1={height}
                        x2={"100%"}
                        y2={height}
                        stroke="black"
                        strokeOpacity={strokeOpacity}
                        strokeWidth={strokeWidth}
                    ></line>
                );
            })}
        </>
    );
};

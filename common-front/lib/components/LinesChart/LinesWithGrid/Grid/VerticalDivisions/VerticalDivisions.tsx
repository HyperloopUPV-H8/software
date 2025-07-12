import { useMemo } from "react";
import { getDivisions } from "../getDivisions";

type Props = {
    divisions: number;
    width: number;
    strokeOpacity: number;
    strokeWidth: number;
    strokeColor?: string;
};

export const VerticalDivisions = ({
    divisions,
    width,
    strokeOpacity,
    strokeWidth,
    strokeColor = "black",
}: Props) => {
    if (divisions == 0) {
        return <></>;
    }

    const widths = useMemo(() => {
        return getDivisions(width, divisions);
    }, [width, divisions]);

    return (
        <>
            {widths.map((width, index) => {
                return (
                    <line
                        shapeRendering={"crispEdges"}
                        vectorEffect={"non-scaling-stroke"}
                        key={index}
                        x1={width}
                        y1={0}
                        x2={width}
                        y2={"100%"}
                        stroke={strokeColor}
                        strokeOpacity={strokeOpacity}
                        strokeWidth={strokeWidth}
                    ></line>
                );
            })}
        </>
    );
};
